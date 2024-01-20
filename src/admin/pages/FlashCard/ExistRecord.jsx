import { useRef, useState } from "react";
function ExistRecord({ recordData, AdminId }) {
  const editFlashCardDialog = useRef();

  const [isEditingContent, setisEditingContent] = useState(false);

  //Handle View Button
  function handleViewButton(url) {
    window.open(url, "_blank").focus();
  }

  //Handle Edit Button
  function handleEditFlashCard() {
    editFlashCardDialog.current.showModal();
  }

  function closeEditFlashCard() {
    editFlashCardDialog.current.close();
  }

  function saveEditFlashCard(event) {
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    console.log(data);
    console.log(data.soundFile.name);
  }

  return (
    <tr>
      <td className="p-2">{recordData.id}</td>
      <td className="p-2">{recordData.title}</td>
      <td className="p-2">
        <button onClick={() => handleViewButton(`${recordData.imageUrl}`)}>
          View Image
        </button>
      </td>
      <td className="p-2">{recordData.description}</td>
      <td className="p-2">
        <button onClick={handleEditFlashCard}>Edit</button>
      </td>
      {/* ----------------Edit Dialog ---------------- */}
      <dialog ref={editFlashCardDialog} className="p-3 rounded-lg">
        <h1 className="mt-2 mb-4">Flash Card</h1>
        <div className="flex justify-around mb-3">
          <h1
            className={`${!isEditingContent && "underline"} cursor-pointer`}
            onClick={() => {
              setisEditingContent(false);
            }}
          >
            Card Detail
          </h1>
          <h1
            className={`${isEditingContent && "underline"} cursor-pointer`}
            onClick={() => {
              setisEditingContent(true);
            }}
          >
            Card Content
          </h1>
        </div>
        <form method="dialog" onSubmit={saveEditFlashCard}>
          {/*----------------- Card Detail ------------------------ */}
          {!isEditingContent && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <label>Title :</label>
                <input
                  type="text"
                  name="title"
                  className="m-2 border"
                  value={recordData.title}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Alt :</label>
                <input
                  type="text"
                  name="alt"
                  className="m-2 border"
                  value={recordData.description}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Image URL :</label>
                <img className="w-10" src={recordData.imageUrl} />
                <input
                  type="file"
                  className="m-2 border"
                  accept=".png, .jpg, .jpeg, .gif "
                  required
                  name="imageUrl"
                />
              </div>
            </div>
          )}
          {/*----------------- Card Content ------------------------ */}

          {isEditingContent && (
            <div className="flex flex-col">
              {recordData.question?.map((question) => {
                return (
                  <div className="flex justify-between items-center my-2 ">
                    <h1 className="mr-3 whitespace-nowrap">
                      ContentID {question.id} :
                    </h1>
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
              })}
              <div className="flex justify-between items-center my-2">
                <h1 className="mr-3">New Content</h1>
                <div className="bg-cyan-300 py-1 px-2 rounded-md">
                  <label htmlFor="title">Content Title :</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="m-2 border"
                    required
                  />
                  <label htmlFor="imageUrl">Image URL :</label>
                  <input
                    name="imageUrl"
                    id="imageUrl"
                    type="text"
                    className="m-2 border"
                    required
                  />
                  <label htmlFor="soundFile">Upload Sound :</label>
                  <input
                    name="soundFile"
                    id="soundFile"
                    type="file"
                    accept=".m4a, .mp3, .webm"
                    className="m-2 border"
                    required
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between m-3">
            <button>Save</button>
            <button type="button" onClick={closeEditFlashCard}>
              Close
            </button>
          </div>
        </form>
      </dialog>
    </tr>
  );
}

export default ExistRecord;
