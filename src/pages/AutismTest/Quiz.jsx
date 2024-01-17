import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { AUTISMTESTDUMMY } from "./AUTISMTESTDUMMY";
import ErrorMessage from "../../components/ErrorMessage";
import { ClerkContext } from "../../store/clerk-user-context";

function Quiz() {
  const { testId } = useParams();
  const ClerkCtx = useContext(ClerkContext).user;
  const [isLoading, setIsLoading] = useState(false);
  const [autismTestContent, setAutismTestContent] = useState({});
  const [targetTestContent, setTargetTestContent] = useState([]);
  const [error, setError] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const clerkId = ClerkCtx.id;

  useEffect(() => {
    async function fetchAutismTestContent() {
      setIsLoading(true);
      const headers = {
        "Content-Type": "application/json",
        ClerkId: clerkId,
      };
      try {
        const response = await fetch(
          "https://api.alexsama.tech/api/autism-test-question",
          { headers }
        );
        const resData = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch Flash Card Information");
        }
        setAutismTestContent(resData.data);
      } catch (error) {
        setError({
          message: error.message || "Failed to fetch Flash Crad Information",
        });
      }

      setIsLoading(false);
    }

    fetchAutismTestContent();
  }, []);

  console.log(autismTestContent);

  // Extract Autism Test Content to current Test ID and put it in target test content array
  useEffect(() => {
    if (
      Object.keys(autismTestContent).length !== 0 &&
      Object.keys(targetTestContent).length === 0
    ) {
      let isFoundedAll = false;
      for (let i = 0; i < autismTestContent.length; i++) {
        if (!isFoundedAll) {
          console.log(autismTestContent[i]);

          if (+autismTestContent[i].autismTestCategoryId === +testId) {
            setTargetTestContent((prev) => [...prev, autismTestContent[i]]);
          } else if (autismTestContent[i].autismTestCategoryId > testId) {
            isFoundedAll = true;
          }
        }
      }
    }
  }, [autismTestContent]);

  useEffect(() => {
    if (
      Object.keys(autismTestContent) !== 0 &&
      Object.keys(targetTestContent) === 0
    ) {
      setError({
        message: error.message || "Failed to fetch Autism Test Content",
      });
    }
  }, [autismTestContent]);
  console.log(targetTestContent);

  const activeQuestion = targetTestContent[activeQuestionIndex];

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

  // if (error !== null) {
  //   return <ErrorMessage errorMessage="Fail to fetch Autism Test Data" />;
  // }

  if (
    Object.keys(targetTestContent).length !== 0 &&
    activeQuestionIndex >= targetTestContent?.length
  ) {
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
      {isLoading && <p>Fetching Autism test Data</p>}
      {Object.keys(targetTestContent).length !== 0 && (
        <div className="bg-cyan-500  max-w-[1000px] m-auto p-[2rem] rounded-xl ">
          <h1 className="text-3xl">
            <span className="mr-3">{`Question ${
              activeQuestionIndex + 1
            } :`}</span>
            {activeQuestion.question}
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
      )}

      <div className="position absolute bottom-0 right-0 p-3 m-5 bg-blue-300 hover:bg-blue-500 rounded-lg">
        <Link to="/autismtest">Exit Test</Link>
      </div>
    </>
  );
}

export default Quiz;
