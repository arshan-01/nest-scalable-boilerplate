import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = this.configService.get('app.email');
    
    this.transporter = nodemailer.createTransporter({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: false,
      auth: {
        user: emailConfig.smtp.auth.user,
        pass: emailConfig.smtp.auth.pass,
      },
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email service configuration error:', error);
      } else {
        this.logger.log('Email service is ready to send messages');
      }
    });
  }

  async sendOTPEmail(email: string, otp: string, type: string = 'verification'): Promise<void> {
    try {
      const subject = this.getOTPSubject(type);
      const html = this.getOTPEmailTemplate(otp, type);

      const mailOptions = {
        from: this.configService.get('app.email.from'),
        to: email,
        subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent to ${email}: ${result.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send OTP email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const subject = 'Welcome to Our Platform!';
      const html = this.getWelcomeEmailTemplate(name);

      const mailOptions = {
        from: this.configService.get('app.email.from'),
        to: email,
        subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${email}: ${result.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  private getOTPSubject(type: string): string {
    const subjects = {
      verification: 'Verify Your Email - OTP Code',
      reset: 'Password Reset - OTP Code',
      login: 'Login OTP Code',
      two_factor: 'Two-Factor Authentication Code',
    };
    return subjects[type] || 'Your OTP Code';
  }

  private getOTPEmailTemplate(otp: string, type: string): string {
    const messages = {
      verification: 'Please use the following code to verify your email address:',
      reset: 'Please use the following code to reset your password:',
      login: 'Please use the following code to complete your login:',
      two_factor: 'Please use the following code for two-factor authentication:',
    };

    const message = messages[type] || 'Please use the following code:';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .otp-code { 
            background-color: #f8f9fa; 
            border: 2px dashed #dee2e6; 
            padding: 20px; 
            text-align: center; 
            font-size: 24px; 
            font-weight: bold; 
            letter-spacing: 5px; 
            margin: 20px 0;
            color: #007bff;
          }
          .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>OTP Code</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>${message}</p>
            <div class="otp-code">${otp}</div>
            <div class="warning">
              <strong>Important:</strong> This code will expire in 5 minutes. Do not share this code with anyone.
            </div>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome!</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Welcome to our platform! We're excited to have you on board.</p>
            <p>Your account has been successfully created and is ready to use.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>Thank you for joining us!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
