import { Award, Download, CheckCircle } from "lucide-react";


const CertificateCard = () => {


  const certificateId = "ICTRD-2026-001245";

  const issueDate = new Date().toLocaleDateString();



  const downloadCertificate = () => {

    alert("Certificate Download Started");

  };



  return (

    <div className="
    mt-8 rounded-3xl
    border border-emerald-400/30
    bg-gradient-to-br
    from-emerald-400/10
    to-cyan-400/10
    p-8
    ">


      <div className="text-center">


        <Award
          size={60}
          className="mx-auto text-yellow-400"
        />



        <h2 className="
        mt-5
        text-3xl
        font-bold
        text-white
        ">

          Congratulations 🎉

        </h2>



        <p className="
        mt-3
        text-gray-300
        ">

          Your certificate is ready!

        </p>





        {/* Certificate Preview */}


        <div className="
        mt-8
        rounded-2xl
        border
        border-white/10
        bg-black/20
        p-6
        ">


          <h3 className="
          text-xl
          font-semibold
          text-white
          ">

            Certificate of Completion

          </h3>



          <p className="
          mt-4
          text-gray-400
          ">

            This certificate is awarded for successfully completing the course assessment.

          </p>



          <div className="
          mt-6
          space-y-3
          text-left
          ">


            <div className="
            flex
            justify-between
            text-gray-300
            ">

              <span>
                Course
              </span>


              <span className="text-white font-semibold">

                MERN Full Stack

              </span>


            </div>




            <div className="
            flex
            justify-between
            text-gray-300
            ">

              <span>
                Certificate ID
              </span>


              <span className="text-white font-semibold">

                {certificateId}

              </span>


            </div>





            <div className="
            flex
            justify-between
            text-gray-300
            ">

              <span>
                Issue Date
              </span>


              <span className="text-white font-semibold">

                {issueDate}

              </span>


            </div>



          </div>



        </div>






        <div className="
        mt-6
        flex
        items-center
        justify-center
        gap-2
        text-emerald-400
        ">

          <CheckCircle size={20}/>

          Verified Certificate

        </div>






        <button

          onClick={downloadCertificate}

          className="
          mt-8
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          bg-gradient-to-r
          from-cyan-400
          to-emerald-400
          py-4
          font-bold
          text-black
          "

        >

          <Download size={20}/>

          Download Certificate


        </button>




      </div>


    </div>

  );

};


export default CertificateCard;