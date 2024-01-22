import { Link } from "react-router-dom";

export default function FlashCardComponent({
  title,
  link,
  image,
  alt,
  state,
}) {
  return (
    <Link to={link} state={state} className="card-item shadow-xl bg-cyan-300">
      <img className="h-4/5 w-full" src={image} alt={alt} />
      <span className="h-1/5 flex justify-center items-center text-xl">{title}</span>
    </Link>
  );
}