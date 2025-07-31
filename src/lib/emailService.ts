import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const generateVerificationEmailHTML = (
  userName: string,
  verificationUrl: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Bad Cigarettes</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111827;">
      <div style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Bad Cigarettes</h1>
        <p style="color: #FEE2E2; margin: 10px 0 0 0; font-weight: bold;">CIGARETTES ARE BAD</p>
      </div>
      
      <div style="background: #1F2937; padding: 30px; border-radius: 0 0 10px 10px; color: white;">
        <h2 style="color: #EF4444; margin-top: 0;">Hi ${userName}!</h2>
        
        <p style="color: #D1D5DB;">Welcome to Bad Cigarettes! Please verify your email address to complete your account setup and start participating in our community.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: #DC2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; transition: background-color 0.3s;">
            Verify Email Address
          </a>
        </div>
        
        <div style="background: #7F1D1D; border: 1px solid #DC2626; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="color: #FCA5A5; font-size: 14px; margin: 0;">
            <strong>⚠️ Important:</strong> This verification link will expire in 5 minutes for security purposes.
          </p>
        </div>
        
        <p style="color: #9CA3AF; font-size: 14px;">
          If you didn't create an account with Bad Cigarettes, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #374151; margin: 30px 0;">
        
        <div style="background: #DC2626; border: 1px solid #B91C1C; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <div style="display: flex; align-items: flex-start;">
            <div style="color: #FCA5A5; margin-right: 10px; font-size: 18px;">⚠️</div>
            <div>
              <h3 style="color: #FEE2E2; margin: 0 0 5px 0; font-size: 14px;">Health Warning</h3>
              <p style="color: #FECACA; margin: 0; font-size: 12px;">
                Cigarettes cause cancer, heart disease, and other serious health conditions. 
                Consider quitting for your health.
              </p>
            </div>
          </div>
        </div>
        
        <p style="color: #6B7280; font-size: 12px; text-align: center;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #EF4444; word-break: break-all;">${verificationUrl}</a>
        </p>
      </div>
    </body>
    </html>
  `;
};