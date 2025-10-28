import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: options.from || this.configService.get<string>('SMTP_FROM'),
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendContactNotification(contactData: any): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    
    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not configured, skipping notification email');
      return;
    }
    
    await this.sendMail({
      to: adminEmail,
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.full_name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Phone:</strong> ${contactData.phone_number || 'N/A'}</p>
        <p><strong>Company:</strong> ${contactData.company || 'N/A'}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message}</p>
      `,
    });
  }

  async sendContactConfirmation(email: string, name: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'We received your message',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Law Company Team</p>
      `,
    });
  }
}

