import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { FLASHCARDDUMMY } from "./FLASHCARDDUMMY";

export default function CardContent() {
  const { flashCardId } = useParams();
  const { contentId } = useParams();

  const [isRotate, setIsRotate] = useState(false);
  const [soundFile, setSoundFile] = useState(null);

  useEffect(() => {
    const file = require(`./soundSrc/${FLASHCARDDUMMY[flashCardId].content[contentId].pathToSound}`);
    setSoundFile(file);
  }, [contentId]);

  function handleRotate() {
    setIsRotate((prev) => !prev);
  }

  function play() {
    new Audio(soundFile).play();
  }

  const nextContentId = +contentId + 1;
  const lastContentId = +contentId - 1;

  return (
    <>
      <div className="flex position relative top-10 h-10 left-[750px]">
        {flashCardId !== "0" && (
          <Link
            to={`/flashcard/${+flashCardId - 1}/0`}
            className=" position absolute right-[250px]"
          >
            Left
          </Link>
        )}
        <h1 className="font-bold text-3xl ">
          {FLASHCARDDUMMY[flashCardId].title}
        </h1>
        {+flashCardId < FLASHCARDDUMMY.length - 1 && (
          <Link
            to={`/flashcard/${+flashCardId + 1}/0`}
            className=" position absolute left-[250px]"
          >
            Right
          </Link>
        )}
      </div>
      <div className="m-10 w-full flex  justify-center items-center">
        <div className="relative w-[1000px] rounded-3xl h-[500px]  flex bg-cyan-500">
          {contentId > 0 && (
            <Link to={`/flashcard/${flashCardId}/${lastContentId}`}>
              <span className="absolute ml-20 cursor-pointer top-[140px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100px"
                  height="100px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M14.9991 19L9.83911 14C9.56672 13.7429 9.34974 13.433 9.20142 13.0891C9.0531 12.7452 8.97656 12.3745 8.97656 12C8.97656 11.6255 9.0531 11.2548 9.20142 10.9109C9.34974 10.567 9.56672 10.2571 9.83911 10L14.9991 5"
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          )}

          <div className="flex flex-col justify-center items-center absolute right-[300px] top-[90px]">
            <div className="w-96 h-[200px]">
              {isRotate === false ? (
                <img
                  className="max-w-96 max-h-48 rounded-2xl"
                  src={
                    FLASHCARDDUMMY[flashCardId].content[contentId].pathToImage
                  }
                />
              ) : (
                <div className="w-96 h-[200px] bg-yellow-500">
                  <h1>
                    {FLASHCARDDUMMY[flashCardId].content[contentId].answer}
                  </h1>
                  <button onClick={play}>Play Sound</button>
                </div>
              )}
            </div>

            <span className="cursor-pointer mt-6" onClick={handleRotate}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90px"
                height="90px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {contentId < FLASHCARDDUMMY[flashCardId].content.length - 1 && (
            <Link to={`/flashcard/${flashCardId}/${nextContentId}`}>
              <span className="cursor-pointer absolute right-[40px] top-[140px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100px"
                  height="100px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 5L14.15 10C14.4237 10.2563 14.6419 10.5659 14.791 10.9099C14.9402 11.2539 15.0171 11.625 15.0171 12C15.0171 12.375 14.9402 12.7458 14.791 13.0898C14.6419 13.4339 14.4237 13.7437 14.15 14L9 19"
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </div>
      <div className="postition absolute right-0 bottom-0 m-5 text-xl ">
        <Link to="/flashcard">Menu</Link>
      </div>
    </>
  );
}
