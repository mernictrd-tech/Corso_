import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PaymentPopup from "./PaymentPopup";

const ResultCard = ({ score, total }) => {
    const [showPayment, setShowPayment] = useState(false);
    const navigate = useNavigate();
    const percentage = Math.round(
        (score / total) * 100
    );


    const passed = percentage >= 70;
    return (
        <div className="min-h-screen bg-[#070B1A] flex items-center justify-center p-6">
            <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                {
                    passed ? (
                        <>
                            <h1 className="text-4xl font-bold text-emerald-400">
                                Congratulations
                            </h1>
                            <p className="mt-5 text-white text-xl">
                                You have passed the assessment
                            </p>
                            <h2 className="mt-6 text-6xl font-bold text-white">
                                {percentage}%
                            </h2>
                            <button

                                onClick={() => setShowPayment(true)}

                                className="
                                mt-8 w-full rounded-xl
                                bg-gradient-to-r from-cyan-400 to-emerald-400
                                py-4 font-bold text-black
                                "
                            >
                                Pay Now For Certificate
                            </button>
                            {
                                showPayment && (

                                    <PaymentPopup />

                                )
                            }

                        </>


                    ) : (


                        <>
                            <h1 className="text-4xl font-bold text-red-400">
                                Try Again
                            </h1>


                            <p className="mt-5 text-white">
                                You need minimum 70% score
                            </p>


                            <h2 className="mt-6 text-6xl font-bold text-white">
                                {percentage}%
                            </h2>


                            <button
                                onClick={() => navigate(-1)}
                                className="
                mt-8 w-full rounded-xl
                bg-red-500
                py-4 font-bold text-white
                "
                            >
                                Retake Assessment
                            </button>

                        </>

                    )

                }

            </div>

        </div>
    );
};


export default ResultCard;