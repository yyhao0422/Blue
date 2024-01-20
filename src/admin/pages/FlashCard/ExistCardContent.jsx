function ExistCardContent({ question, refreshFlashCard }) {
  return (
    <div className="flex justify-between items-center my-2 ">
      <h1 className="mr-3 whitespace-nowrap">ContentID {question.id} :</h1>
      <div className="flex w-full border py-2 px-2 rounded-md">
        <div className="flex items-center mx-2 w-1/3">
          <label>Content Title :</label>
          <p className="mx-3">{question.question}</p>
        </div>
        <div className="flex items-center mx-2 w-1/3">
          <label>Image URL :</label>
          <img src={question.imageUrl} className="w-10 mx-3" />
        </div>
        <div className="flex items-center mx-2 w-1/3">
          <label>Sound Src:</label>
          <p className="mx-3">{question.soundUrl}</p>
        </div>
      </div>
    </div>
  );
}

export default ExistCardContent;
