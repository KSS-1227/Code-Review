import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Code Review App - Email Verification',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .otp-box {
              background: white;
              border: 2px solid #667eea;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 5px;
              margin: 10px 0;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Code Review App</h1>
            <p>Email Verification Required</p>
          </div>
          
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for registering with Code Review App. To complete your registration, please verify your email address using the verification code below:</p>
            
            <div class="otp-box">
              <h3>Your Verification Code</h3>
              <div class="otp-code">${otp}</div>
              <p><strong>This code will expire in ${process.env.OTP_EXPIRE_MINUTES} minutes</strong></p>
            </div>
            
            <div class="warning">
              <strong>Security Notice:</strong>
              <ul>
                <li>Never share this code with anyone</li>
                <li>Our team will never ask for this code via phone or email</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
            
            <p>After entering this code, you'll be able to access all features of the Code Review App, including AI-powered code analysis and suggestions.</p>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>Code Review App Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Code Review App. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Code Review App! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .feature-box {
              background: white;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 15px 0;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to Code Review App!</h1>
            <p>Your account has been successfully verified</p>
          </div>
          
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Congratulations! Your email has been verified and your account is now active.</p>
            
            <h3>🚀 What you can do now:</h3>
            
            <div class="feature-box">
              <h4>📝 AI Code Review</h4>
              <p>Submit your code and get intelligent feedback and suggestions from our AI</p>
            </div>
            
            <div class="feature-box">
              <h4>🔍 Code Analysis</h4>
              <p>Get detailed analysis of code quality, potential bugs, and performance improvements</p>
            </div>
            
            <div class="feature-box">
              <h4>💡 Smart Suggestions</h4>
              <p>Receive actionable recommendations to improve your code</p>
            </div>
            
            <p>Ready to get started? <a href="http://localhost:5173/dashboard" style="color: #667eea; text-decoration: none; font-weight: bold;">Visit your Dashboard</a></p>
            
            <p>Happy coding!<br>
            <strong>The Code Review App Team</strong></p>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};
