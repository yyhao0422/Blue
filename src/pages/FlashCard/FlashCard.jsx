import Card from "../../components/Card";
import animal from "./cardsrc/animal.jpg";
import bodyPart from "./cardsrc/body-parts.webp";
import dailyRoutine from "./cardsrc/daily-routine.jpg";
import time from "./cardsrc/time.webp";

export default function FlashCard() {
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-bold text-5xl mt-5">Flash Card</h1>
      <div className="flex w-fit">
        <Card
          title="Animal Flashcards"
          pathToImage={animal}
          link="/flashcard/animal"
        />
        <Card
          title="Bodyparts Flashcards"
          pathToImage={bodyPart}
          link="/flashcard/bodypart"
        />
        <Card
          title="Telling Time Flashcards"
          pathToImage={time}
          link="/flashcard/time"
        />
        <Card
          title="Daily Routine Flashcards"
          pathToImage={dailyRoutine}
          link="/flashcard/dailyroutine"
        />
      </div>
    </div>
  );
}
