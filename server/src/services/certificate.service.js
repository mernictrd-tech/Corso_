const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const QRCode = require("qrcode");

/*
|--------------------------------------------------------------------------
| Certificate configuration
|--------------------------------------------------------------------------
*/

const CERTIFICATE_WIDTH = 2000;
const CERTIFICATE_HEIGHT = 1414;

// Keep the certificate template outside src if you want it to be
// easily replaceable without touching the service logic.
const TEMPLATE_PATH = path.join(
  __dirname,
  "../assets/certificate.png"
);

/*
|--------------------------------------------------------------------------
| Optional fonts
|--------------------------------------------------------------------------
|
| Put font files here if you want the backend certificate to match
| the frontend exactly.
|
| Example:
|
| server/src/assets/fonts/
|   PlayfairDisplay-Bold.ttf
|   Inter-Regular.ttf
|
*/

// registerFont(
//   path.join(__dirname, "../assets/fonts/PlayfairDisplay-Bold.ttf"),
//   {
//     family: "Playfair Display",
//     weight: "700",
//   }
// );

/*
|--------------------------------------------------------------------------
| Date formatter
|--------------------------------------------------------------------------
*/

const formatCertificateDate = (date) => {
  try {
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return String(date || "");
    }

    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

/*
|--------------------------------------------------------------------------
| Certificate data normalizer
|--------------------------------------------------------------------------
|
| Keeps the generator independent from your MongoDB document structure.
|--------------------------------------------------------------------------
*/

const normalizeCertificateData = (certificate = {}) => {
  const studentName =
    certificate.studentName ||
    certificate.user?.fullName ||
    certificate.name ||
    "Student";

  const programName =
    certificate.programName ||
    certificate.program?.name ||
    certificate.title ||
    certificate.program ||
    "Certification";

  const certificateId =
    certificate.certificateId ||
    certificate.id ||
    "CRS-2026-001";

  const tid =
    certificate.tid ||
    certificate.user?.tid ||
    "TID";

  const documentIdentifier =
    certificate.documentIdentifier ||
    `DOC-${
      String(certificate._id || certificateId)
        .slice(-8)
        .toUpperCase() || "9842104"
    }`;

  const skiliumId =
    certificate.skiliumId ||
    `SKLM-${String(certificateId).replace(
      /[^a-zA-Z0-9]/g,
      ""
    )}`;

  const issueDate =
    certificate.issueDate ||
    certificate.createdAt ||
    certificate.issuedOn ||
    new Date();

  const verificationUrl =
    certificate.verificationUrl ||
    `https://skilium.in/verify-certificate/${certificateId}`;

  return {
    studentName,
    programName,
    certificateId,
    tid,
    documentIdentifier,
    skiliumId,
    issueDate: formatCertificateDate(issueDate),
    verificationUrl,
  };
};

/*
|--------------------------------------------------------------------------
| Generate certificate PNG
|--------------------------------------------------------------------------
|
| Returns a Buffer.
|
| This is intentionally NOT tied to HTTP or Express.
|
| You can use it from:
|
| - payment controller
| - email service
| - download API
| - admin regeneration
| - verification system
|--------------------------------------------------------------------------
*/

const generateCertificatePNG = async (certificate) => {
  const data = normalizeCertificateData(certificate);

  const canvas = createCanvas(
    CERTIFICATE_WIDTH,
    CERTIFICATE_HEIGHT
  );

  const ctx = canvas.getContext("2d");

  /*
  |--------------------------------------------------------------------------
  | Load certificate background
  |--------------------------------------------------------------------------
  */

  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(
      `Certificate template not found: ${TEMPLATE_PATH}`
    );
  }

  const template = await loadImage(TEMPLATE_PATH);

  ctx.drawImage(
    template,
    0,
    0,
    CERTIFICATE_WIDTH,
    CERTIFICATE_HEIGHT
  );

  /*
  |--------------------------------------------------------------------------
  | Student Name
  |--------------------------------------------------------------------------
  */

  ctx.fillStyle = "#00f0ff";

  ctx.font =
    '700 100px "Playfair Display", "Times New Roman", serif';

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = "rgba(0, 240, 255, 0.4)";
  ctx.shadowBlur = 12;

  ctx.fillText(
    data.studentName,
    CERTIFICATE_WIDTH * 0.5,
    CERTIFICATE_HEIGHT * 0.480
  );

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  /*
  |--------------------------------------------------------------------------
  | Program Name
  |--------------------------------------------------------------------------
  */

  ctx.fillStyle = "#FFFFFF";

  ctx.font =
    '700 70px "Playfair Display", "Times New Roman", serif';

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    String(data.programName).toUpperCase(),
    CERTIFICATE_WIDTH * 0.5,
    CERTIFICATE_HEIGHT * 0.648
  );

  /*
  |--------------------------------------------------------------------------
  | Metadata
  |--------------------------------------------------------------------------
  */

  ctx.fillStyle = "#cbd5e1";

  ctx.font =
    '600 38px "Inter", "Segoe UI", sans-serif';

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  /*
   * TID
   */
  ctx.fillText(
    data.tid,
    CERTIFICATE_WIDTH * 0.285,
    CERTIFICATE_HEIGHT * 0.835
  );

  /*
   * Document ID
   */
  ctx.fillText(
    data.documentIdentifier,
    CERTIFICATE_WIDTH * 0.385,
    CERTIFICATE_HEIGHT * 0.875
  );

  /*
   * Issue Date
   */
  ctx.fillText(
    data.issueDate,
    CERTIFICATE_WIDTH * 0.375,
    CERTIFICATE_HEIGHT * 0.91
  );

  /*
  |--------------------------------------------------------------------------
  | QR Code
  |--------------------------------------------------------------------------
  */

  const qrBuffer = await QRCode.toBuffer(
    data.verificationUrl,
    {
      type: "png",
      width: 240,
      margin: 0,
      errorCorrectionLevel: "H",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    }
  );

  const qrImage = await loadImage(qrBuffer);

  /*
   * QR position matches the React certificate preview.
   */
  const qrSize = 240;

  const qrX =
    CERTIFICATE_WIDTH * 0.11 - qrSize / 2;

  const qrY =
    CERTIFICATE_HEIGHT * 0.85 - qrSize / 2;

  /*
   * White background around QR
   */
  ctx.fillStyle = "#ffffff";

  ctx.fillRect(
    qrX - 5,
    qrY - 5,
    qrSize + 10,
    qrSize + 10
  );

  ctx.drawImage(
    qrImage,
    qrX,
    qrY,
    qrSize,
    qrSize
  );

  /*
  |--------------------------------------------------------------------------
  | Return PNG Buffer
  |--------------------------------------------------------------------------
  */

  return {
    buffer: canvas.toBuffer("image/png"),
    data,
  };
};

/*
|--------------------------------------------------------------------------
| Save certificate PNG
|--------------------------------------------------------------------------
|
| Useful when you want the certificate available later.
|--------------------------------------------------------------------------
*/

const saveCertificatePNG = async (
  certificate,
  outputDirectory
) => {
  const { buffer, data } =
    await generateCertificatePNG(certificate);

  const directory =
    outputDirectory ||
    path.join(
      __dirname,
      "../../storage/certificates"
    );

  await fs.promises.mkdir(directory, {
    recursive: true,
  });

  const filename =
    `certificate-${data.certificateId}.png`;

  const filePath =
    path.join(directory, filename);

  await fs.promises.writeFile(
    filePath,
    buffer
  );

  return {
    filePath,
    filename,
    buffer,
    certificate: data,
  };
};

module.exports = {
  generateCertificatePNG,
  saveCertificatePNG,
  normalizeCertificateData,
};