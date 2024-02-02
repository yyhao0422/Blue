import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import { motion } from "framer-motion";
import CardContent from "@mui/material/CardContent";

import ErrorMessage from "../../components/ErrorMessage";
import loader from "../../images/loader.gif";
import { ClerkContext } from "../../store/clerk-user-context";
import { Button, Typography } from "@mui/material";

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
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5 }}
        animate={{ opacity: 1, y: -100 }}
        exit={{ opacity: 0 }}
        className="h-min m-auto  "
      >
        <Card
          sx={{
            maxWidth: "500px",
          }}
          className="p-5 leading-6"
        >
          <Typography
            variant="h3"
            sx={{ marginBottom: 5 }}
            className="text-center"
          >
            Your score is{" "}
            <span
              className={`${userScore <= 6 ? "text-red-400" : "text-blue-400"}`}
            >{`${userScore}`}</span>
          </Typography>
          <hr />
          <div>
            <Typography variant="subtitle1" sx={{ margin: 3 }}>
              {userScore <= 6
                ? "Consider referring them for a specialist diagnostic assessment."
                : "H'She are normal or mild, consider referring them for a specialist diagnostic assessment for more detail"}
            </Typography>
            <br />
            <Typography variant="caption">
              <span className="text-bold">USE:</span>
              This is the adolescent version of the test recommended in the NICE
              clinical guideline CG142.{" "}
              <a
                href="//www.nice.org.uk/CG142"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500"
              >
                www.nice.org.uk/CG142
              </a>
            </Typography>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="postion absolute left-[700px] top-[300px]">
          <img src={loader} alt="loading.gif" height="100" width="100" />
        </div>
      )}
      {Object.keys(targetTestContent).length !== 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
          animate={{ opacity: 1, y: -100 }}
          exit={{ opacity: 0 }}
          className="h-min m-auto  "
        >
          <Card
            sx={{
              maxWidth: "1000px",
            }}
            className="p-5 leading-6"
          >
            <h1 className="text-3xl text-center mb-4">
              <span className="mr-3 ">{`Question ${
                activeQuestionIndex + 1
              } :`}</span>
              {activeQuestion.question}
            </h1>
            <hr />
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Button variant="contained" sx={{ marginTop: 2 }}>
                <Typography
                  className="cursor-pointer"
                  onClick={() => {
                    handleAnswer(activeQuestionIndex, "definiteAgree");
                  }}
                >
                  Definitely Agree
                </Typography>
              </Button>
              <Button variant="contained" sx={{ marginTop: 2 }}>
                <Typography
                  className="cursor-pointer"
                  onClick={() => {
                    handleAnswer(activeQuestionIndex, "slightlyAgree");
                  }}
                >
                  Slightly Agree
                </Typography>
              </Button>
              <Button variant="contained" sx={{ marginTop: 2 }}>
                <Typography
                  className="cursor-pointer"
                  onClick={() => {
                    handleAnswer(activeQuestionIndex, "slightlyDisagree");
                  }}
                >
                  Slightly Disagree
                </Typography>
              </Button>
              <Button variant="contained" sx={{ marginTop: 2 }}>
                <Typography
                  className="cursor-pointer"
                  onClick={() => {
                    handleAnswer(activeQuestionIndex, "definitelyDisagree");
                  }}
                >
                  Definitely Disagree
                </Typography>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="position absolute bottom-0 right-0 p-3 m-5 bg-blue-300 hover:bg-blue-500 rounded-lg">
        <Link to="/autismtest">Exit Test</Link>
      </div>
    </>
  );
}

export default Quiz;
