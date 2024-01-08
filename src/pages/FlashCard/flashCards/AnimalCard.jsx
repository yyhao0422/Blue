import leftArrow from "../cardsrc/left-arrow.gif";
import rightArrow from "../cardsrc/right-arrow.gif";
import rotate from "../cardsrc/rotate.gif";

export default function AnimalCard() {
  return (
    <div className="m-10 w-full flex justify-center items-center">
      <div>
        <span className="ml-20">
          <img className="w-36" src={leftArrow} />
        </span>
        <div>
          <img
            className="w-96"
            src="https://wallup.net/wp-content/uploads/2018/10/06/719354-white-rabbit-rabbit-bunny-baby-easter.jpg"
          />
          <span>
            <img className="w-36" src={rotate} />
          </span>
        </div>
        <span>
          <img className="w-36" src={rightArrow} />
        </span>
      </div>
    </div>
  );
}
