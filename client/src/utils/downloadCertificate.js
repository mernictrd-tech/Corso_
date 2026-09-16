import certificateTemplate from "../assets/images/certificate.png";
import toast from "react-hot-toast";
import QRCode from "qrcode";

/**
 * Download certificate as high-resolution PNG.
 *
 * Coordinates are based on the CertificateCard preview.
 */
export const downloadCertificate = async (
  certificate = {},
  userProfile = {},
) => {
  let toastId;

  try {
    // ---------------------------------------------------------
    // Certificate Data
    // ---------------------------------------------------------

    const studentName =
      certificate?.studentName ||
      certificate?.user?.fullName ||
      userProfile?.fullName ||
      certificate?.name ||
      "Student";

    const programName =
      certificate?.program?.name ||
      certificate?.programName ||
      certificate?.title ||
      certificate?.program ||
      "Certification";

    const certificateId =
      certificate?.certificateId ||
      certificate?.id ||
      `CRS-${String(certificate?._id || "2026")
        .slice(-6)
        .toUpperCase()}`;

    const tid = certificate?.tid || certificate?.user?.tid || "TID";

    const documentIdentifier =
      certificate?.documentIdentifier ||
      `DOC-${
        String(certificate?._id || certificateId)
          .slice(-8)
          .toUpperCase() || "9842104"
      }`;

    const rawDate =
      certificate?.issueDate ||
      certificate?.createdAt ||
      certificate?.issuedOn ||
      new Date();

    const formattedDate = (() => {
      try {
        const d = new Date(rawDate);

        if (isNaN(d.getTime())) {
          return String(rawDate);
        }

        return d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } catch {
        return "29 Jul 2026";
      }
    })();

    const verificationUrl = `https://skilium.in/verify-certificate/${certificateId}`;

    toastId = toast.loading("Preparing certificate download...");

    // ---------------------------------------------------------
    // Load Certificate Template
    // ---------------------------------------------------------

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = certificateTemplate;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const w = img.naturalWidth || 2000;
    const h = img.naturalHeight || 1414;

    const canvas = document.createElement("canvas");

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to create canvas context.");
    }

    // ---------------------------------------------------------
    // Background
    // ---------------------------------------------------------

    ctx.drawImage(img, 0, 0, w, h);

    // ---------------------------------------------------------
    // Percentage Helpers
    // ---------------------------------------------------------

    const x = (percentage) => w * (percentage / 100);
    const y = (percentage) => h * (percentage / 100);

    // ---------------------------------------------------------
    // FONT SIZES
    //
    // Increased from the previous version.
    // These are designed around a 2000x1414 certificate.
    // ---------------------------------------------------------

    const studentFontSize = 78;
    const programFontSize = 55;
    const metadataFontSize = 35;

    // ---------------------------------------------------------
    // STUDENT NAME
    //
    // Preview:
    // top: 45.6%
    // left: 50%
    // ---------------------------------------------------------

    ctx.save();

    ctx.fillStyle = "#67e8f9";

    ctx.font = `
      700
      ${studentFontSize}px
      "Playfair Display",
      "Times New Roman",
      Georgia,
      serif
    `;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(6, 182, 212, 0.65)";
    ctx.shadowBlur = 14;

    ctx.fillText(String(studentName), x(50), y(49.5));

    ctx.restore();

    // ---------------------------------------------------------
    // PROGRAM / COURSE NAME
    //
    // Preview:
    // top: 64.8%
    // left: 50%
    // ---------------------------------------------------------

    ctx.save();

    ctx.fillStyle = "#ffffff";

    ctx.font = `
      700
      ${programFontSize}px
      "Playfair Display",
      "Times New Roman",
      Georgia,
      serif
    `;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(String(programName).toUpperCase(), x(50), y(64.8));

    ctx.restore();

    // ---------------------------------------------------------
    // TID
    //
    // Preview:
    // top: 84.2%
    // left: 28.5%
    // ---------------------------------------------------------

    ctx.save();

    ctx.fillStyle = "#cbd5e1";

    ctx.font = `
      600
      ${metadataFontSize}px
      "Courier New",
      monospace
    `;

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.fillText(String(tid), x(28.5), y(84.2));

    ctx.restore();

    // ---------------------------------------------------------
    // DOCUMENT ID
    //
    // Preview:
    // top: 87.5%
    // left: 38.5%
    // ---------------------------------------------------------

    ctx.save();

    ctx.fillStyle = "#cbd5e1";

    ctx.font = `
      600
      ${metadataFontSize}px
      "Courier New",
      monospace
    `;

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.fillText(String(documentIdentifier), x(38.5), y(87.5));

    ctx.restore();

    // ---------------------------------------------------------
    // ISSUE DATE
    //
    // Preview:
    // top: 91%
    // left: 37.5%
    // ---------------------------------------------------------

    ctx.save();

    ctx.fillStyle = "#cbd5e1";

    ctx.font = `
      600
      ${metadataFontSize}px
      Arial,
      sans-serif
    `;

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.fillText(formattedDate, x(37.5), y(91));

    ctx.restore();

    // ---------------------------------------------------------
    // QR CODE
    // ---------------------------------------------------------

    const qrCanvas = document.createElement("canvas");

    // Bigger QR
    const qrSize = 250;

    await QRCode.toCanvas(qrCanvas, verificationUrl, {
      errorCorrectionLevel: "H",
      margin: 0,
      width: qrSize,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    // White padding around QR
    const qrPadding = Math.round(h * 0.006);

    const qrContainerSize = qrSize + qrPadding * 2;

    // Preview:
    // left: 11%
    // top: 85%
    //
    // transform:
    // translate(-50%, -50%)

    const qrCenterX = x(11);
    const qrCenterY = y(85);

    const qrX = qrCenterX - qrContainerSize / 2;

    const qrY = qrCenterY - qrContainerSize / 2;

    // ---------------------------------------------------------
    // QR WHITE CONTAINER
    // ---------------------------------------------------------

    ctx.save();

    ctx.fillStyle = "#ffffff";

    const radius = Math.round(h * 0.003);

    ctx.beginPath();

    ctx.roundRect(qrX, qrY, qrContainerSize, qrContainerSize, radius);

    ctx.fill();

    ctx.restore();

    // ---------------------------------------------------------
    // QR IMAGE
    // ---------------------------------------------------------

    ctx.drawImage(qrCanvas, qrX + qrPadding, qrY + qrPadding, qrSize, qrSize);

    // ---------------------------------------------------------
    // DOWNLOAD
    // ---------------------------------------------------------

    const safeName = String(programName)
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    const fileName = `Skilium_Certificate_${safeName || "Certificate"}_${certificateId}.png`;

    const link = document.createElement("a");

    link.download = fileName;

    link.href = canvas.toDataURL("image/png", 1.0);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    toast.success("Certificate downloaded successfully!", {
      id: toastId,
    });

    return true;
  } catch (error) {
    console.error("Certificate download error:", error);

    if (toastId) {
      toast.error("Failed to download certificate.", {
        id: toastId,
      });
    } else {
      toast.error("Failed to download certificate.");
    }

    return false;
  }
};
