import { Link } from "react-router-dom";

export default function Card({ title, pathToImage, link }) {
  return (
    <Link
      className="m-10 pt-5 hover:bg-cyan-500 h-80 rounded-md cursor-pointer"
      to={link}
    >
      <div className="w-48 h-48 m-10">
        <img className="w-fit  rounded-lg" src={pathToImage} />
      </div>
      <h2 className="text-center">{title}</h2>
    </Link>
  );
}
