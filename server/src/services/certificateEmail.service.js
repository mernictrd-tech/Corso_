const { sendEmail } = require("./ses.service");

/**
 * Send certificate email to the student.
 *
 * @param {Object} options
 * @param {string} options.email - Student email
 * @param {string} options.studentName - Student full name
 * @param {string} options.programName - Program name
 * @param {string} options.certificateId - Certificate ID
 * @param {string} options.certificateFilePath - Generated certificate PNG path
 * @param {string} [options.verificationUrl] - Certificate verification URL
 * @returns {Promise<Object>}
 */
const sendCertificateEmail = async ({
  email,
  studentName,
  programName,
  tid,
  score,
  certificateId,
  certificateFilePath,
  verificationUrl,
}) => {
  if (!email) {
    throw new Error("Student email is required.");
  }

  if (!certificateFilePath) {
    throw new Error("Certificate file path is required.");
  }

  const verifyUrl =
    verificationUrl || `https://skilium.in/verify-certificate/${certificateId}`;

  const subject = `Congratulations! Your ${programName} Certificate`;

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your Skilium Certificate</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #1e293b;
    ">
      <div style="
        max-width: 650px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
      ">

        <!-- Header -->
        <div style="
          padding: 28px;
          text-align: center;
          background: #07111f;
        ">
          <img
            src="https://skilium.in/assets/skilium-logo-without-bg-DARK.png"
            alt="Skilium"
            width="150"
            style="
              display: block;
              width: 150px;
              max-width: 100%;
              height: auto;
              margin: 0 auto;
              border: 0;
            "
          />
        </div>

        <!-- Main Content -->
        <div style="padding: 35px 30px;">

          <h2 style="
            margin-top: 0;
            color: #0f172a;
          ">
            Congratulations, ${studentName}!
          </h2>

          <p style="
            font-size: 16px;
            line-height: 1.7;
            color: #475569;
          ">
            You have successfully completed your assessment and earned
            your Skilium certification.
          </p>

          <p style="
            font-size: 15px;
            line-height: 1.7;
            color: #475569;
          ">
            Your certification has been issued to your Skilium profile
            under <strong>TID: ${tid}</strong>. Please find your official
            certificate attached to this email.
          </p>

          <!-- Certificate Details -->
          <div style="
            margin: 25px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          ">

            <p style="
              margin: 8px 0;
              font-size: 15px;
              color: #334155;
            ">
              <strong>Program:</strong>
              ${programName}
            </p>

            <p style="
              margin: 8px 0;
              font-size: 15px;
              color: #334155;
            ">
              <strong>Certificate ID:</strong>
              ${certificateId}
            </p>

            <p style="
              margin: 8px 0;
              font-size: 15px;
              color: #334155;
            ">
              <strong>TID:</strong>
              ${tid}
            </p>

            <p style="
              margin: 8px 0;
              font-size: 15px;
              color: #334155;
            ">
              <strong>Final Score:</strong>
              <span style="
                color: #059669;
                font-weight: bold;
              ">
                ${score}%
              </span>
            </p>

          </div>

          <p style="
            font-size: 15px;
            line-height: 1.6;
            color: #475569;
          ">
            Your official certificate is attached to this email as a
            high-resolution PNG file.
          </p>

          <!-- Verification Button -->
          <div style="
            text-align: center;
            margin: 30px 0;
          ">
            <a
              href="${verifyUrl}"
              style="
                display: inline-block;
                padding: 13px 24px;
                background: #06b6d4;
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Verify Certificate
            </a>
          </div>

          <p style="
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
          ">
            You can use the verification link above to verify the
            authenticity of your certificate at any time.
          </p>

        </div>

        <!-- Footer -->
        <div style="
          padding: 20px 30px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        ">
          <p style="
            margin: 0;
            font-size: 12px;
            color: #64748b;
          ">
            This is an automated email from Skilium.
            Please do not reply to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
`;

  const text = `
Congratulations, ${studentName}!

You have successfully completed your assessment and earned your
Skilium certification.

Program: ${programName}
Certificate ID: ${certificateId}

Your official certificate is attached to this email.

Verify your certificate:
${verifyUrl}

Regards,
Skilium
  `.trim();

  const result = await sendEmail({
    to: email,
    subject,
    html,
    text,

    attachments: [
      {
        filename: `Skilium_Certificate_${certificateId}.png`,
        path: certificateFilePath,
        contentType: "image/png",
      },
    ],
  });

  return result;
};

module.exports = {
  sendCertificateEmail,
};
