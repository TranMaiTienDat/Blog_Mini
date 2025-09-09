const nodemailer = require('nodemailer');

// Cấu hình email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // Hoặc service khác như Outlook, Yahoo
    auth: {
      user: process.env.EMAIL_USER, // Email của bạn
      pass: process.env.EMAIL_PASS  // App password của email
    }
  });
};

// Template email xác nhận
const getVerificationEmailTemplate = (username, verificationCode) => {
  return {
    subject: 'Verify Your Email - Blog Mini Platform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .verification-code { background: #007bff; color: white; font-size: 24px; font-weight: bold; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; letter-spacing: 3px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Email Verification</h1>
            <p>Welcome to Blog Mini Platform!</p>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Thank you for registering with Blog Mini Platform. To complete your registration, please verify your email address.</p>
            
            <p><strong>Your verification code is:</strong></p>
            <div class="verification-code">${verificationCode}</div>
            
            <p>Please enter this code in the verification form to activate your account.</p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This code will expire in <strong>15 minutes</strong></li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this verification, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Best regards,<br>Blog Mini Platform Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Gửi email xác nhận
const sendVerificationEmail = async (email, username, verificationCode) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = getVerificationEmailTemplate(username, verificationCode);
    
    const mailOptions = {
      from: `"Blog Mini Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error: error.message };
  }
};

// Gửi email chào mừng sau khi xác nhận thành công
const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Blog Mini Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to Blog Mini Platform!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745, #1e7e34); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007bff; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Blog Mini!</h1>
              <p>Your account has been successfully verified!</p>
            </div>
            <div class="content">
              <h2>Hello ${username}!</h2>
              <p>Congratulations! Your email has been verified and your account is now active.</p>
              
              <h3>🚀 What you can do now:</h3>
              <div class="feature">
                <strong>✍️ Create Posts:</strong> Share your thoughts and ideas with the community
              </div>
              <div class="feature">
                <strong>💬 Comment & Engage:</strong> Join conversations and connect with other users
              </div>
              <div class="feature">
                <strong>👍 Vote & React:</strong> Show appreciation for great content
              </div>
              <div class="feature">
                <strong>📝 Manage Profile:</strong> Customize your profile and settings
              </div>
              
              <p>Start exploring and become part of our amazing community!</p>
              
              <p>Happy blogging!<br>Blog Mini Platform Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail
};
