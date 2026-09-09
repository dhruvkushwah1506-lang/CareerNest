// Sends email via Brevo's REST API (over HTTPS) instead of raw SMTP.
// Render's free tier blocks outbound SMTP ports (25/465/587), so nodemailer+Gmail
// cannot work there - this uses plain HTTPS instead, which is never blocked.
// Sign up free at https://app.brevo.com (300 emails/day, no credit card needed).

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;

    if (!apiKey || !senderEmail) {
        throw new Error('Email is not configured. Missing BREVO_API_KEY or BREVO_SENDER_EMAIL on the server.');
    }

    const response = await fetch(BREVO_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': apiKey
        },
        body: JSON.stringify({
            sender: { name: 'CareerNest', email: senderEmail },
            to: [{ email: toEmail }],
            subject: 'Reset your CareerNest password',
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                    <h2 style="color: #111;">Reset your password</h2>
                    <p>We received a request to reset your CareerNest password. Click the button below to choose a new one. This link expires in 30 minutes.</p>
                    <a href="${resetUrl}" style="display:inline-block; padding: 12px 24px; background:#111; color:#fff; text-decoration:none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
                    <p style="color:#666; font-size: 13px;">If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>
                </div>
            `
        })
    });

    if (!response.ok) {
        const errBody = await response.text().catch(() => '');
        throw new Error(Brevo request failed (${response.status}): ${errBody});
    }
};