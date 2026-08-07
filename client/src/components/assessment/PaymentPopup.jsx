import { useState } from "react";
import CertificateCard from "./CertificateCard";


const PaymentPopup = () => {

  const [paid, setPaid] = useState(false);


  if(paid){
    return <CertificateCard />;
  }


  return (

    <div className="
    mt-6 rounded-2xl
    bg-white/5
    border border-white/10
    p-6
    text-center
    ">


      <h2 className="text-2xl font-bold text-white">
        Complete Payment
      </h2>


      <p className="mt-3 text-gray-400">
        Pay to unlock your certificate
      </p>



      <div className="mt-5 text-4xl font-bold text-white">
        ₹499
      </div>



      <button

        onClick={()=>setPaid(true)}

        className="
        mt-6 w-full rounded-xl
        bg-gradient-to-r
        from-cyan-400
        to-emerald-400
        py-3
        font-bold
        text-black
        "

      >
        Pay Now
      </button>


    </div>

  );
};


export default PaymentPopup;