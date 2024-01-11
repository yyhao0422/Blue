import useImage from "../hooks/useImage";

const Image = ({ fileName, alt }) => {
  const { loading, error, image } = useImage(fileName);

  if (error) return { alt };

  return <>{loading ? loading : <img src={image} alt={alt} />}</>;
};

export default Image;
