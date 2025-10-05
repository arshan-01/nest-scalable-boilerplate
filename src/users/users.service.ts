import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/user.entity';
import { HashUtil } from '../common/utils/hash.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(userId);
    
    // Remove sensitive fields that shouldn't be updated directly
    const { password, email, id, createdAt, updatedAt, ...allowedUpdates } = updateData;
    
    Object.assign(user, allowedUpdates);
    return this.userRepository.save(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findById(userId);
    
    if (!user.password) {
      throw new ConflictException('User does not have a password set');
    }

    const isCurrentPasswordValid = await HashUtil.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new ConflictException('Current password is incorrect');
    }

    user.password = await HashUtil.hashPassword(newPassword);
    await this.userRepository.save(user);
  }

  async deactivateUser(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.isActive = false;
    return this.userRepository.save(user);
  }

  async activateUser(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.isActive = true;
    return this.userRepository.save(user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }

  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .where('user.name ILIKE :query OR user.email ILIKE :query', { query: `%${query}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return { users, total };
  }
}
