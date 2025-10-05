export class OtpUtil {
  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  static generateSecureOTP(length: number = 6): string {
    const buffer = require('crypto').randomBytes(Math.ceil(length / 2));
    const otp = buffer.toString('hex').slice(0, length);
    return otp;
  }

  static isOTPExpired(expiresAt: Date): boolean {
    return new Date() > new Date(expiresAt);
  }
}
