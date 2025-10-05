import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../common/entities/user.entity';
import { Session } from '../common/entities/session.entity';
import { Otp, OtpType, OtpStatus } from '../common/entities/otp.entity';
import { HashUtil } from '../common/utils/hash.util';
import { OtpUtil } from '../common/utils/otp.util';
import { EmailService } from '../shared/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(userData: { name: string; email: string; password: string }): Promise<User> {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      name,
      email,
      password: await HashUtil.hashPassword(password),
    });

    const savedUser = await this.userRepository.save(user);

    // Send OTP for email verification
    await this.sendVerificationOTP(email);

    return savedUser;
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: any }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await HashUtil.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Create session and tokens
    const tokens = await this.createSession(user);

    return { user, tokens };
  }

  async loginWithOTP(email: string, otp: string): Promise<{ user: User; tokens: any }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or OTP');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify OTP
    const otpRecord = await this.otpRepository.findOne({
      where: { email, otp, type: OtpType.LOGIN, status: OtpStatus.PENDING },
    });

    if (!otpRecord || OtpUtil.isOTPExpired(otpRecord.expiresAt)) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    otpRecord.status = OtpStatus.USED;
    otpRecord.usedAt = new Date();
    await this.otpRepository.save(otpRecord);

    // Update last login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Create session and tokens
    const tokens = await this.createSession(user);

    return { user, tokens };
  }

  async sendLoginOTP(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const otp = OtpUtil.generateOTP();
    const otpRecord = this.otpRepository.create({
      userId: user.id,
      email: user.email,
      otp,
      type: OtpType.LOGIN,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    await this.otpRepository.save(otpRecord);
    await this.emailService.sendOTPEmail(user.email, otp, 'login');
  }

  async sendVerificationOTP(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new ConflictException('Email is already verified');
    }

    const otp = OtpUtil.generateOTP();
    const otpRecord = this.otpRepository.create({
      userId: user.id,
      email: user.email,
      otp,
      type: OtpType.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    await this.otpRepository.save(otpRecord);
    await this.emailService.sendOTPEmail(user.email, otp, 'verification');
  }

  async verifyEmail(email: string, otp: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new ConflictException('Email is already verified');
    }

    const otpRecord = await this.otpRepository.findOne({
      where: { email, otp, type: OtpType.EMAIL_VERIFICATION, status: OtpStatus.PENDING },
    });

    if (!otpRecord || OtpUtil.isOTPExpired(otpRecord.expiresAt)) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    otpRecord.status = OtpStatus.USED;
    otpRecord.usedAt = new Date();
    await this.otpRepository.save(otpRecord);

    // Update user email verification status
    user.emailVerified = true;
    await this.userRepository.save(user);
  }

  async refreshToken(refreshToken: string): Promise<{ user: User; tokens: any }> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken, isActive: true },
      relations: ['user'],
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = session.user;
    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Generate new tokens
    const tokens = await this.createSession(user);

    // Deactivate old session
    session.isActive = false;
    await this.sessionRepository.save(session);

    return { user, tokens };
  }

  async logout(refreshToken: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken, isActive: true },
    });

    if (session) {
      session.isActive = false;
      await this.sessionRepository.save(session);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionRepository.update(
      { userId, isActive: true },
      { isActive: false },
    );
  }

  private async createSession(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Create session record
    const session = this.sessionRepository.create({
      userId: user.id,
      refreshToken,
      accessToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await this.sessionRepository.save(session);

    return { accessToken, refreshToken };
  }
}
