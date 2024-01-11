import { Link } from "react-router-dom";

export default function FlashCardComponent({
  title,
  link,
  image,
  alt,
  state,
  children,
}) {
  return (
    <Link
      className="m-10 pt-5 hover:bg-cyan-500 h-80 rounded-md cursor-pointer"
      to={link}
      state={state}
    >
      <div className="flex justify-center items-center w-48 h-48 m-10">
        <img className="max-h-48" src={image} alt={alt} />
        {children}
      </div>
      <h2 className="text-center">{title}</h2>
    </Link>
  );
}
