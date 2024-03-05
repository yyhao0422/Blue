import { useEffect, useRef, useState } from "react";
import "./FlashCard.css";
import { useUser } from "@clerk/clerk-react";
import _ from "underscore";
import { Link } from "react-router-dom";

export default function FlashCard() {
  const { isSignedIn, user } = useUser();
  const [flashCards, setFlashCards] = useState([]);

  const cardThemes =
    [
      {
        baseColor: 'bg-red-400',
        subColor: 'bg-orange-600',
        innerColor: 'bg-rose-950'
      },
      {
        baseColor: 'bg-violet-400',
        subColor: 'bg-sky-600',
        innerColor: 'bg-blue-950'
      },
      {
        baseColor: 'bg-orange-400',
        subColor: 'bg-yellow-600',
        innerColor: 'bg-amber-950'
      }
    ]

  const getCardTheme = (index) => {
    return cardThemes[index % cardThemes.length];
  }

  const cardInnerRefs = useRef([]);

  const handleMouseEnter = (index) => {
    cardInnerRefs.current[index].style.transform = 'rotateY(180deg)';
  }

  const handleMouseLeave = (index) => {
    cardInnerRefs.current[index].style.transform = '';
  }

  useEffect(() => {
    cardInnerRefs.current = cardInnerRefs.current.slice(0, flashCards.length);

    if (isSignedIn) {
      const headers = {
        "Content-Type": "application/json",
        ClerkId: user.id,
      };

      const fetchFlashCard = () => {
        return fetch("https://api.alexsama.tech/api/flash-card-category/", {
          headers
        }).then(res => res.json());
      }

      fetchFlashCard().then(res => {
        if (res.message !== "success") {
          throw new Error("Failed to fetch Flash Card Information");
        }
        setFlashCards(res.data);
      })
    }
  }, [isSignedIn, user, flashCards.length])

  return (
    <div className="p-16 !grid grid-cols-4 grid-rows-2 gap-x-3 gap-y-5 !w-full dark:bg-slate-800">
      {
        flashCards.map((category, idx) => {
          const cardTheme = getCardTheme(idx);
          const frontBodyStyle = `flex flex-col gap-5 items-center pt-10 h-[630px] rounded-xl shadow-2xl ${cardTheme.baseColor}`
          const backBodyStyle = `flex justify-center items-center h-[630px] mt-[-630px] rounded-xl shadow-2xl ${cardTheme.baseColor}`
          const innerStyle = `flex justify-between items-center px-5 mt-auto h-[70px] w-full rounded-xl ${cardTheme.innerColor}`
          const endStyle = `inline-block px-5 py-2 rounded-lg cursor-pointer ${cardTheme.subColor}`

          return (
            <div className="flip-card" key={`card-${idx}`}>
              <div className="flip-card-inner" ref={el => cardInnerRefs.current[idx] = el}>
                <div className="flip-card-front">
                  <div className={frontBodyStyle}>
                    <div className="text-xs text-white text-right w-full px-5">Card {idx + 1}</div>
                    <div className="flip-card-profile h-[250px] w-[250px] bg-white rounded-full overflow-hidden"
                      onMouseEnter={() => handleMouseEnter(idx)}
                      onMouseLeave={() => handleMouseLeave(idx)}>
                      <img className="h-full w-full object-cover" src={category.imageUrl} alt={category.title} />
                    </div>
                    <div className="w-full px-5 text-white">
                      <div className="text-2xl font-bold">{category.title}</div>
                      <div className="text-sm text-right font-thin">All Questions</div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white">
                          <div>Quite</div>
                          <div>Hard..!</div>
                        </div>
                        <div className="flex my-5 gap-3 justify-end">
                          {
                            _.take(category.question, 3).map((question, idx) => (
                              <div className="h-[50px] w-[50px] bg-white rounded-md overflow-hidden" key={`quest-${idx}`}>
                                <img className="h-full w-full object-cover" src={question.imageUrl} alt={question.title} />
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                    <div className={innerStyle}>
                      <div className="text-white text-xs underline underline-offset-4">A great card.</div>
                      <div className={endStyle}>
                        <Link to={`/flashcard/${category.id}`}>Try me now</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className={backBodyStyle}>
                    <span className="text-xs text-center text-white p-5">{category.description}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )

}