import { useEffect, useState } from "react";
import questions from "../../data/questions";
import ResultCard from "./ResultCard";


const Assessment = () => {


  const [showResult, setShowResult] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selected, setSelected] = useState("");

  const [score, setScore] = useState(0);

  const [time, setTime] = useState(600);



  // Timer
  useEffect(() => {

    const timer = setInterval(() => {

      setTime((prev) => {

        if (prev <= 0) {

          clearInterval(timer);

          setShowResult(true);

          return 0;

        }

        return prev - 1;

      });


    }, 1000);



    return () => clearInterval(timer);


  }, []);




  // Show Result
  if (showResult) {

    return (

      <ResultCard
        score={score}
        total={questions.length}
      />

    );

  }




  const question = questions[currentQuestion];




  const handleNext = () => {


    let finalScore = score;



    // Check Answer

    if (selected === question.answer) {

      finalScore = score + 1;

      setScore(finalScore);

    }




    setSelected("");





    // Next Question

    if (currentQuestion < questions.length - 1) {


      setCurrentQuestion(currentQuestion + 1);


    } 
    else {


      setScore(finalScore);

      setShowResult(true);


    }



  };





  return (

    <div className="min-h-screen bg-[#070B1A] p-10">


      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">





        {/* Header */}

        <div className="flex justify-between">


          <h2 className="text-2xl font-bold text-white">

            Question {currentQuestion + 1}/{questions.length}

          </h2>



          <div className="font-bold text-cyan-400">


            {Math.floor(time / 60)}:
            {String(time % 60).padStart(2, "0")}


          </div>



        </div>







        {/* Question */}


        <h3 className="mt-10 text-xl text-white">

          {question.question}

        </h3>







        {/* Options */}


        <div className="mt-6 space-y-4">


          {
            question.options.map((option) => (


              <label

                key={option}

                className="
                flex cursor-pointer gap-3
                rounded-xl bg-white/5
                p-4 text-gray-300
                hover:bg-white/10
                "

              >


                <input

                  type="radio"

                  name="answer"

                  value={option}

                  checked={selected === option}

                  onChange={(e)=>setSelected(e.target.value)}

                />


                {option}


              </label>


            ))
          }



        </div>






        {/* Button */}


        <button


          onClick={handleNext}


          className="
          mt-8 w-full rounded-xl
          bg-gradient-to-r from-cyan-400 to-emerald-400
          py-4 font-bold text-black
          hover:scale-[1.02]
          transition
          "


        >


          {
            currentQuestion === questions.length - 1

            ? "Submit Assessment"

            : "Next Question"

          }



        </button>





      </div>


    </div>

  );


};


export default Assessment;