import Card from "../../components/Card";
import animal from "./cardImages/animal.jpg";
import bodyPart from "./cardImages/body-parts.webp";
import dailyRoutine from "./cardImages/daily-routine.jpg";
import time from "./cardImages/time.webp";

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
