import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { AUTISMTESTDUMMY } from "./AUTISMTESTDUMMY";
import ErrorMessage from "../../components/ErrorMessage";

function Quiz() {
  const { testId } = useParams();

  const [userScore, setUserScore] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  if (AUTISMTESTDUMMY[testId] === undefined) {
    return <ErrorMessage errorMessage="URL path parameter is not found !" />;
  }

  const activeQuestion = AUTISMTESTDUMMY[testId].question[activeQuestionIndex];

  function handleAnswer(activeQuestionIndex, answer) {
    if (
      [1, 5, 8, 10].includes(activeQuestionIndex) &&
      (answer === "definiteAgree" || answer === "slightlyAgree")
    ) {
      setUserScore((prev) => prev + 1);
    } else if (
      [2, 3, 4, 6, 7, 9].includes(activeQuestionIndex) &&
      (answer === "definitelyDisagree" || answer === "slightlyDisagree")
    ) {
      setUserScore((prev) => prev + 1);
    }
    setActiveQuestionIndex((prev) => prev + 1);
  }

  if (activeQuestionIndex >= AUTISMTESTDUMMY[testId].question.length) {
    return (
      <div>
        {`Your score is ${userScore}`}
        <div>
          <p>
            {userScore >= 6
              ? "Consider referring them for a specialist diagnostic assessment."
              : "H'She are normal or mild, consider referring them for a specialist diagnostic assessment for more detail"}
          </p>
          <br />
          <p>
            <span className="text-bold">USE:</span>
            This is the adolescent version of the test recommended in the NICE
            clinical guideline CG142. www.nice.org.uk/CG142
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="bg-cyan-500  max-w-[1000px] m-auto p-[2rem] rounded-xl ">
        <h1 className="text-3xl">
          <span className="mr-3">{`Question ${
            activeQuestionIndex + 1
          } :`}</span>
          {activeQuestion.text}
        </h1>
        <div className="flex flex-col mt-5">
          <div
            className="cursor-pointer"
            onClick={() => {
              handleAnswer(activeQuestionIndex, "definiteAgree");
            }}
          >
            Definitely Agree
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              handleAnswer(activeQuestionIndex, "slightlyAgree");
            }}
          >
            Slightly Agree
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              handleAnswer(activeQuestionIndex, "slightlyDisagree");
            }}
          >
            Slightly Disagree
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              handleAnswer(activeQuestionIndex, "definitelyDisagree");
            }}
          >
            Definitely Disagree
          </div>
        </div>
      </div>

      <div className="position absolute bottom-0 right-0 p-3 m-5 bg-blue-300 hover:bg-blue-500 rounded-lg">
        <Link to="/autismtest">Exit Test</Link>
      </div>
    </>
  );
}

export default Quiz;
