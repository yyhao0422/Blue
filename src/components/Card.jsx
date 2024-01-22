import { Link } from "react-router-dom";
import "./Card.scoped.css";

export default function FlashCardComponent({
  title,
  link,
  image,
  alt,
  state,
  children,
}) {
  return (
    <Link to={link} state={state} className="card-item">
      <img className="h-4/5" src={image} alt={alt} />
      <span className="align-text-middle bg-red-500">{title}</span>
    </Link>
  );
}