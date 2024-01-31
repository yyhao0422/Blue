import { useState, useEffect, useContext, Fragment } from "react";
import QuizIcon from "@mui/icons-material/Quiz";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import loader from "../../images/loader.gif";
import imageUnavailable from "../../images/image-unavailable.jpg";
import audioSpeaker from "../../images/audio.svg";
import leftArrow from "../../images/left-arrow.svg";
import rightArrow from "../../images/right-arrow.svg";
import { Button } from "@mui/material";

import ErrorMessage from "../../components/ErrorMessage";
import { ClerkContext } from "../../store/clerk-user-context";

export default function CardContent() {
  const clerkCtx = useContext(ClerkContext).user;
  const { flashCardId } = useParams();
  const [flashCardContent, setFlashCardContent] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRotate, setIsRotate] = useState(false);
  const [isReveal, setIsReveal] = useState(false);

  const [activeFlashCardIndex, setActiveFlashCardIndex] = useState(0);

  const clerkID = clerkCtx.id;
  let currentFlashCardCategory;

  useEffect(() => {
    async function fetchFlashCard() {
      setIsLoading(true);

      try {
        const headers = {
          "Content-Type": "application/json",
          ClerkId: clerkID,
        };

        const response = await fetch(
          `https://api.alexsama.tech/api/flash-card-category/`,
          { headers }
        );
        const resData = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch Flash Card Information");
        }

        setFlashCardContent(resData.data);
      } catch (error) {
        setError({
          message: error.message || "Failed to fetch Flash Crad Information",
        });
      }
      setIsLoading(false);
    }

    fetchFlashCard();
  }, []);

  if (flashCardContent === undefined) {
    return <ErrorMessage errorMessage="Flash Card ID is not valid" />;
  }

  function handleRotate() {
    setIsRotate((prev) => !prev);
  }

  function handleLeftClick() {
    var toIndex = activeFlashCardIndex - 1;
    if (toIndex === -1) return;

    setActiveFlashCardIndex((prev) => prev - 1);
  }

  function handleRightClick() {
    var toIndex = activeFlashCardIndex + 1;
    if (toIndex >= currentFlashCardCategory.question.length) return;

    setActiveFlashCardIndex((prev) => prev + 1);
    setIsReveal(false);
  }

  function playAudio(url) {
    new Audio(url).play();
  }

  console.log(flashCardContent);

  if (flashCardContent.length > 0) {
    try {
      function getCurrentFlashCardCategory() {
        for (let i = 0; i < flashCardContent.length; i++) {
          if (+flashCardContent[i].id === +flashCardId) {
            currentFlashCardCategory = { ...flashCardContent[i] };
          }
        }
      }

      getCurrentFlashCardCategory();
      if (currentFlashCardCategory === undefined) {
        throw new Error("Failed to fetch Flash Card Information");
      }
    } catch (e) {
      setError({
        message: error.message || "Failed to fetch Flash Card Information",
      });
    }
  }
  console.log(currentFlashCardCategory);

  if (error !== "") {
    console.log(error);
    return <ErrorMessage errorMessage={error.message} />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <img src={loader} alt="loading.gif" height="100" width="100" />
      </div>
    );
  }

  var currentCard = currentFlashCardCategory?.question[activeFlashCardIndex];

  return (
    <Fragment>
      {isLoading ? (
        <div className="flex h-screen w-full justify-center items-center">
          <img src={loader} alt="loading.gif" height="100" width="100" />
        </div>
      ) : (
        <div className="flex justify-center w-full items-center">
          <motion.div
            className="flex-col space-y-5"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            animate={{ opacity: 1, x: 100 }}
            exit={{ opacity: 0 }}
          >
            <div tabIndex="0"></div>
            <div className="text-center">Animals</div>
            <div className="flex items-center space-x-5">
              <img
                className="cursor-pointer hover:scale-150 transition-all duration-900"
                src={leftArrow}
                alt="left-arrow.svg"
                height="50"
                width="50"
                onClick={handleLeftClick}
              />
              <div className="bg-gradient-to-r from-[#BBD0FF] to-[#C8B6FF] shadow-2xl p-5">
                <div className="flex items-center h-[500px] border-solid border-2 border-black color-slate p-5">
                  <div className="flex-col space-y-5 transition-all duration-500">
                    <img
                      className="h-40 w-[250px] rounded-2xl"
                      src={currentCard.imageUrl ?? imageUnavailable}
                      alt="card content"
                    />
                    <span
                      className={`block text-center text-xl ease-in-out transition-all duration-500 ${
                        isReveal ? "scale-125 translate-y-10 " : ""
                      } `}
                    >
                      {isReveal ? currentCard.question : <QuizIcon />}
                    </span>
                    <div
                      className={`flex ease-in-out transition-all duration-500 justify-center ${
                        isReveal ? "translate-y-20" : ""
                      }`}
                    >
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (!isReveal) {
                            playAudio(currentCard.soundUrl);
                          }
                          setIsReveal((prev) => !prev);
                        }}
                        sx={{ backgroundcolor: "#c8b6ff" }}
                      >
                        {`${!isReveal ? "Reveal" : "Hide"}`}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <img
                className="cursor-pointer hover:scale-150 "
                src={rightArrow}
                alt="right-arrow.svg"
                height="50"
                width="50"
                onClick={handleRightClick}
              />
            </div>
          </motion.div>
        </div>
      )}
    </Fragment>
  );
}
