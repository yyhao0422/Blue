export default function Card({ title, pathToImage }) {
  return (
    <div className="m-5">
      <img src={pathToImage} />
      {title}
    </div>
  );
}
