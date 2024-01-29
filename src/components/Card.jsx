import { Link } from "react-router-dom";

export default function FlashCardComponent({ title, link, image, alt, state }) {
  return (
    <Link
      to={link}
      state={state}
      className="bg-gradient-to-r from-[#FFD6FF] to-[#E7C6FF] card-item overflow-hidden p-5 pb-0 transition-all duration-500 hover:shadow-2xl hover:scale-105 group"
    >
      <img
        className="h-4/5 w-full group-hover:rounded-none rounded-3xl"
        src={image}
        alt={alt}
      />
      <span className="h-1/5 flex justify-center items-center text-xl">
        {title}
      </span>
    </Link>
  );
}

//
