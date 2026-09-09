import nodemailer from 'nodemailer';

// Uses a Gmail account + App Password (not your normal Gmail password).
// EMAIL_USER = the Gmail address sending the emails
// EMAIL_PASS = a 16-character App Password generated from Google Account settings

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
});

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email is not configured. Missing EMAIL_USER or EMAIL_PASS on the server.');
    }

    await transporter.sendMail({
        from: `"CareerNest" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Reset your CareerNest password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #111;">Reset your password</h2>
                <p>We received a request to reset your CareerNest password. Click the button below to choose a new one. This link expires in 30 minutes.</p>
                <a href="${resetUrl}" style="display:inline-block; padding: 12px 24px; background:#111; color:#fff; text-decoration:none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
                <p style="color:#666; font-size: 13px;">If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>
            </div>
        `
    });
};
