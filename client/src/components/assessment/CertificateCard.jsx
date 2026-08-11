import { Download, CheckCircle } from "lucide-react";

import certificateTemplate from "../../assets/images/certificate.png";

const CertificateCard = ({ certificate }) => {
  /*
  |--------------------------------------------------------------------------
  | Dynamic Data
  |--------------------------------------------------------------------------
  */

  const studentName =
    certificate?.studentName ||
    certificate?.user?.fullName ||
    "";

  const programName =
    certificate?.program?.name ||
    certificate?.programName ||
    "";

  const corsoId =
    certificate?.corsoId ||
    certificate?.program?._id ||
    "";

  const documentIdentifier =
    certificate?.documentIdentifier ||
    "";

  const certificateId =
    certificate?.certificateId ||
    "";

  const achievementDate = certificate?.issueDate
    ? new Date(
        certificate.issueDate
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  /*
  |--------------------------------------------------------------------------
  | Download Certificate
  |--------------------------------------------------------------------------
  */

  const downloadCertificate = () => {
    const canvas =
      document.createElement("canvas");

    canvas.width = 1464;
    canvas.height = 1024;

    const ctx =
      canvas.getContext("2d");

    const image = new Image();

    image.onload = () => {
      /*
      |--------------------------------------------------------------------------
      | Original Certificate
      |--------------------------------------------------------------------------
      */

      ctx.drawImage(
        image,
        0,
        0,
        1464,
        1024
      );

      /*
      |--------------------------------------------------------------------------
      | STUDENT NAME
      |--------------------------------------------------------------------------
      */

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = "#ffffff";

      ctx.font =
        "32px Georgia, 'Times New Roman', serif";

      ctx.fillText(
        studentName,
        732,
        548
      );

      /*
      |--------------------------------------------------------------------------
      | COURSE NAME
      |--------------------------------------------------------------------------
      */

      ctx.fillStyle = "#00d9e8";

      ctx.font =
        "bold 30px Arial, Helvetica, sans-serif";

      ctx.fillText(
        programName,
        732,
        645
      );

      /*
      |--------------------------------------------------------------------------
      | CORSO ID
      |--------------------------------------------------------------------------
      |
      | Original certificate already contains:
      |
      | Corso ID :
      |
      | We only add the value.
      |--------------------------------------------------------------------------
      */

      ctx.textAlign = "left";

      ctx.fillStyle = "#ffffff";

      ctx.font =
        "18px Arial, Helvetica, sans-serif";

      ctx.fillText(
        corsoId,
        365,
        890
      );

      /*
      |--------------------------------------------------------------------------
      | DOCUMENT IDENTIFIER
      |--------------------------------------------------------------------------
      */

      ctx.fillText(
        documentIdentifier,
        430,
        925
      );

      /*
      |--------------------------------------------------------------------------
      | ACHIEVEMENT DATE
      |--------------------------------------------------------------------------
      */

      ctx.textAlign = "center";

      ctx.fillText(
        achievementDate,
        1045,
        890
      );

      /*
      |--------------------------------------------------------------------------
      | Download PNG
      |--------------------------------------------------------------------------
      */

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert(
              "Unable to generate certificate."
            );

            return;
          }

          const url =
            URL.createObjectURL(blob);

          const link =
            document.createElement("a");

          link.href = url;

          link.download =
            `Corso-Certificate-${certificateId}.png`;

          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);

          URL.revokeObjectURL(url);
        },
        "image/png"
      );
    };

    image.onerror = () => {
      alert(
        "Unable to load certificate template."
      );
    };

    image.src = certificateTemplate;
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full bg-[#070B1A] px-4 py-8">

      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}

        <div className="mb-6 text-center">

          <CheckCircle
            size={42}
            className="mx-auto text-emerald-400"
          />

          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Certificate Generated
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Congratulations! Your certificate is ready.
          </p>

        </div>


        {/* =====================================================
            CERTIFICATE PREVIEW
        ===================================================== */}

        <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black">

          <div
            className="relative w-full"
            style={{
              aspectRatio: "1464 / 1024",
            }}
          >

            {/* Original Certificate */}

            <img
              src={certificateTemplate}
              alt="Corso Certificate"
              className="absolute inset-0 h-full w-full object-cover"
            />


            {/* =================================================
                STUDENT NAME
            ================================================= */}

            <div
              className="
                absolute
                left-[23%]
                top-[51.5%]
                w-[54%]
                text-center
              "
            >

              <p
                className="
                  truncate
                  font-serif
                  text-[clamp(13px,2.5vw,32px)]
                  font-medium
                  text-white
                "
              >
                {studentName}
              </p>

            </div>


            {/* =================================================
                COURSE NAME
            ================================================= */}

            <div
              className="
                absolute
                left-[27%]
                top-[63%]
                w-[46%]
                text-center
              "
            >

              <p
                className="
                  truncate
                  text-[clamp(10px,1.8vw,26px)]
                  font-bold
                  text-[#00d9e8]
                "
              >
                {programName}
              </p>

            </div>


            {/* =================================================
                CORSO ID
            ================================================= */}

            <div
              className="
                absolute
                bottom-[10.2%]
                left-[19%]
                text-[clamp(5px,0.8vw,13px)]
                text-white
              "
            >
              {corsoId}
            </div>


            {/* =================================================
                DOCUMENT IDENTIFIER
            ================================================= */}

            <div
              className="
                absolute
                bottom-[6.6%]
                left-[24%]
                text-[clamp(5px,0.8vw,13px)]
                text-white
              "
            >
              {documentIdentifier}
            </div>


            {/* =================================================
                DATE
            ================================================= */}

            <div
              className="
                absolute
                bottom-[10.2%]
                right-[17%]
                text-[clamp(5px,0.8vw,13px)]
                text-white
              "
            >
              {achievementDate}
            </div>

          </div>

        </div>


        {/* =====================================================
            INFO
        ===================================================== */}

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <InfoCard
            label="Student"
            value={studentName}
          />

          <InfoCard
            label="Program"
            value={programName}
          />

          <InfoCard
            label="Certificate ID"
            value={certificateId}
          />

          <InfoCard
            label="Document Identifier"
            value={documentIdentifier}
          />

        </div>


        {/* =====================================================
            DOWNLOAD
        ===================================================== */}

        <button
          type="button"
          onClick={downloadCertificate}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-cyan-400
            to-emerald-400
            py-3.5
            font-bold
            text-black
            transition
            hover:opacity-90
          "
        >

          <Download size={20} />

          Download Certificate

        </button>

      </div>

    </div>
  );
};


/*
|--------------------------------------------------------------------------
| Info Card
|--------------------------------------------------------------------------
*/

const InfoCard = ({
  label,
  value,
}) => {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
        {value || "-"}
      </p>

    </div>
  );
};


export default CertificateCard;