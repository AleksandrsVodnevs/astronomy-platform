const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken, firstName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/atjaunot-paroli/${resetToken}`;
  await transporter.sendMail({
    from: `"AstroLV platforma" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Paroles atjaunošana — AstroLV',
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0a0e1a;color:#f1f5f9;padding:2rem;border-radius:12px;">
      <h2 style="color:#4f8ef7;text-align:center;">AstroLV</h2>
      <p>Sveiks, ${firstName}!</p>
      <p>Nospied pogu zemāk, lai izveidotu jaunu paroli:</p>
      <div style="text-align:center;margin:2rem 0;">
        <a href="${resetUrl}" style="background:#4f8ef7;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Atjaunot paroli</a>
      </div>
      <p style="color:#94a3b8;font-size:0.85rem;">Saite derīga 1 stundu.</p>
    </div>`,
  });
};

const sendVerificationCode = async (toEmail, code, type) => {
  const isRegister = type === 'register';
  const subject = isRegister ? 'Reģistrācijas apstiprināšana — AstroLV' : 'E-pasta maiņas apstiprināšana — AstroLV';
  const heading = isRegister ? 'Apstipriniet savu e-pastu' : 'Apstipriniet e-pasta maiņu';
  const description = isRegister
    ? 'Lai pabeigtu reģistrāciju, ievadiet zemāk norādīto kodu:'
    : 'Lai apstiprinātu e-pasta adreses maiņu, ievadiet zemāk norādīto kodu:';

  await transporter.sendMail({
    from: `"AstroLV platforma" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0a0e1a;color:#f1f5f9;padding:2rem;border-radius:12px;">
      <h2 style="color:#4f8ef7;text-align:center;">AstroLV</h2>
      <h3 style="text-align:center;">${heading}</h3>
      <p>${description}</p>
      <div style="text-align:center;margin:2rem 0;">
        <div style="background:#1a2235;border:2px solid #4f8ef7;border-radius:12px;padding:1.5rem;display:inline-block;">
          <span style="font-size:2.5rem;font-weight:900;letter-spacing:0.5rem;color:#4f8ef7;">${code}</span>
        </div>
      </div>
      <p style="color:#94a3b8;font-size:0.85rem;text-align:center;">Kods derīgs 15 minūtes. Ja tu nepieprasīji šo kodu, ignorē šo e-pastu.</p>
    </div>`,
  });
};

module.exports = { sendPasswordResetEmail, sendVerificationCode };
