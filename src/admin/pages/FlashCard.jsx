import { useRef, useState } from "react";

function FlashCard() {
  const newFlashCardDialog = useRef();
  const editFlashCardDialog = useRef();

  const [isEditingContent, setisEditingContent] = useState(false);

  function handleNewFlashCard() {
    newFlashCardDialog.current.showModal();
  }

  function closeNewFlashCard() {
    newFlashCardDialog.current.close();
  }

  function saveNewFlashCard() {
    console.log("Saved");
    newFlashCardDialog.current.close();
  }

  function handleEditFlashCard() {
    editFlashCardDialog.current.showModal();
  }

  function closeEditFlashCard() {
    editFlashCardDialog.current.close();
  }

  function saveEditFlashCard() {}

  return (
    <>
      <div className="bg-cyan-400 p-3 h-fit m-3 rounded-md w-screen">
        <div className="flex justify-between">
          <h1 className="text-xl ">Flash Card Maintainance</h1>
          <button
            className="bg-cyan-700 hover:bg-cyan-900 text-white p-3 rounded-xl"
            onClick={handleNewFlashCard}
          >
            New Flashcard
          </button>
        </div>

        <table className="m-3 ">
          <thead>
            <tr>
              <th className="p-2">Flash Card ID</th>
              <th className="p-2">Flash Card Title</th>
              <th className="p-2">Image Src</th>
              <th className="p-2">Alt</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-2">001</td>
              <td className="p-2">demo</td>
              <td className="p-2">Img Src </td>
              <td className="p-2">Alt</td>
              <td className="p-2">
                <button onClick={handleEditFlashCard}>Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <dialog ref={newFlashCardDialog} className="p-3 rounded-lg">
        <h1 className="mt-2 mb-4">New Flash Card</h1>
        <form method="dialog">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <label>Title :</label>
              <input type="text" className="m-2 border" />
            </div>
            <div className="flex justify-between items-center">
              <label>Image URL :</label>
              <input type="text" className="m-2 border" />
            </div>
            <div className="flex justify-between items-center">
              <label>Alt :</label>
              <input type="text" className="m-2 border" />
            </div>
          </div>
          <div className="flex justify-between m-3">
            <button type="button" onClick={saveNewFlashCard}>
              Save
            </button>
            <button type="button" onClick={closeNewFlashCard}>
              Close
            </button>
          </div>
        </form>
      </dialog>
      <dialog ref={editFlashCardDialog} className="p-3 rounded-lg">
        <h1 className="mt-2 mb-4">New Flash Card</h1>
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
        <form method="dialog">
          {!isEditingContent && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <label>Title :</label>
                <input type="text" className="m-2 border" />
              </div>
              <div className="flex justify-between items-center">
                <label>Image URL :</label>
                <input type="text" className="m-2 border" />
              </div>
              <div className="flex justify-between items-center">
                <label>Alt :</label>
                <input type="text" className="m-2 border" />
              </div>
            </div>
          )}
          {isEditingContent && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <h1 className="mr-3">Content 1</h1>
                <div className="bg-cyan-300 py-1 px-2 rounded-md">
                  <label>Content Title :</label>
                  <input type="text" className="m-2 border" />
                  <label>Image URL :</label>
                  <input type="text" className="m-2 border" />
                  <label>Sound URL :</label>
                  <input type="text" className="m-2 border" />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between m-3">
            <button type="button" onClick={saveEditFlashCard}>
              Save
            </button>
            <button type="button" onClick={closeEditFlashCard}>
              Close
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default FlashCard;
