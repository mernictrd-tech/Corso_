import certificateTemplate from "../assets/images/certificate.png";
import toast from "react-hot-toast";

/**
 * Directly downloads the certificate as a PNG without opening a modal.
 * @param {object} certificate - certificate data object
 * @param {object} userProfile  - user profile object (for fallback name)
 */
export const downloadCertificate = (certificate, userProfile) => {
  try {
    const studentName =
      certificate?.studentName ||
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
      "CRS-2026-001";

    const corsoId =
      certificate?.corsoId ||
      `CRSO-${String(certificateId).replace(/[^a-zA-Z0-9]/g, "") || "2026"}`;

    const documentIdentifier =
      certificate?.documentIdentifier ||
      `DOC-${String(certificate?._id || certificateId).slice(-8).toUpperCase() || "9842104"}`;

    const rawDate =
      certificate?.issueDate ||
      certificate?.createdAt ||
      certificate?.issuedOn ||
      new Date();

    const formattedDate = (() => {
      try {
        const d = new Date(rawDate);
        if (isNaN(d.getTime())) return String(rawDate);
        return d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } catch {
        return String(rawDate || "29 Jul 2026");
      }
    })();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = certificateTemplate;

    const toastId = toast.loading("Preparing certificate download...");

    img.onload = () => {
      const w = img.naturalWidth || 2000;
      const h = img.naturalHeight || 1414;
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);

      ctx.fillStyle = "#00f0ff";
      ctx.font = `600 ${Math.round(h * 0.054)}px "Playfair Display", "Times New Roman", Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 240, 255, 0.4)";
      ctx.shadowBlur = 12;
      ctx.fillText(studentName, w * 0.5, h * 0.456);

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${Math.round(h * 0.044)}px "Playfair Display", "Times New Roman", Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(programName).toUpperCase(), w * 0.5, h * 0.648);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = `600 ${Math.round(h * 0.018)}px "Inter", "Segoe UI", sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(corsoId, w * 0.23, h * 0.862);
      ctx.fillText(documentIdentifier, w * 0.29, h * 0.902);
      ctx.fillText(formattedDate, w * 0.77, h * 0.885);

      const safeName = String(programName).replace(/[^a-zA-Z0-9]/g, "_");
      const link = document.createElement("a");
      link.download = `Corso_Certificate_${safeName}_${certificateId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Certificate downloaded successfully!", { id: toastId });
    };

    img.onerror = () => {
      toast.error("Failed to load certificate template.", { id: toastId });
    };
  } catch (err) {
    console.error("Download error:", err);
    toast.error("An error occurred during download.");
  }
};
