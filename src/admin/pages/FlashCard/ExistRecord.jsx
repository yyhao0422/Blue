import { useRef, useState } from "react";
function ExistRecord({ recordData, AdminId, refreshFlashCard }) {
  const editFlashCardDialog = useRef();

  const [isEditingContent, setisEditingContent] = useState(false);
  const [isDeleteLoading, setIsDeleletLoading] = useState(false);
  const [isUpdateCardDetail, setIsUpdateCardDetail] = useState(false);
  const [updateFlashCardResult, setUpdateFlashCardResult] = useState(null);
  const [error, setError] = useState("");

  async function handleDeleteFlashCard() {
    setIsDeleletLoading(true);
    try {
      const response = await fetch(
        `https://api.alexsama.tech/api/flash-card-category/${recordData.id}`,
        {
          method: "DELETE",
          headers: {
            ClerkId: AdminId,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Fail to delete Flash Card !");
      }

      const resData = await response.json();
    } catch (error) {
      setError({
        message: error.message || `Fail to delete Flash Card !`,
      });
    }
    setIsDeleletLoading(false);
    refreshFlashCard();
  }
  //Handle Edit Button
  function handleEditFlashCard() {
    editFlashCardDialog.current.showModal();
  }

  function closeEditFlashCard() {
    editFlashCardDialog.current.close();
  }

  async function handleEditCardDetail(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    const uploadImageHeaders = new Headers();
    uploadImageHeaders.append("ClerkId", AdminId);
    uploadImageHeaders.append("Accept", "application/json");
    // Image data
    const imageFile = fd.get("upload"); // File that  get from form data
    const bodyImage = new FormData(); // Create a new form data that needed to pass in to body
    bodyImage.append("upload", imageFile);
    bodyImage.append("dirname", "Images");
    // Upload Image Request Option
    const imageRequestOption = {
      method: "POST",
      headers: uploadImageHeaders,
      body: bodyImage,
    };

    setIsUpdateCardDetail(true);
    try {
      const responseUploadNewImage = await fetch(
        `https://api.alexsama.tech/api/upload-file`,
        imageRequestOption
      );

      const resDataNewImage = await responseUploadNewImage.json();

      if (!responseUploadNewImage) {
        throw new Error("Failed to update FLash Card Images");
      }

      const response = await fetch(
        ` https://api.alexsama.tech/api/flash-card-category/${recordData.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            imageUrl: resDataNewImage.data,
            flashCardQuestionIds: [],
          }),
          headers: {
            "Content-type": "application/json",
            ClerkId: AdminId,
          },
        }
      );
      const resData = await response.json();
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to update Flash Card Information");
      }
      if (resData.message === "success") {
        setUpdateFlashCardResult("Form submitted successfully ! ");
        refreshFlashCard();
      }
    } catch (error) {
      setError({
        message: error.message || "Failed to fetch Flash Crad Information",
      });
    }

    setIsUpdateCardDetail(false);
  }

  return (
    <tr>
      <td className="p-2">{recordData.id}</td>
      <td className="p-2">{recordData.title}</td>
      <td className="p-2">
        <img src={recordData.imageUrl} className="w-10" />
      </td>
      <td className="p-2">{recordData.description}</td>
      <td className="p-2">
        <button className="mx-2" onClick={handleEditFlashCard}>
          Edit
        </button>
        {!isDeleteLoading && (
          <button className="mx-2" onClick={handleDeleteFlashCard}>
            Delete
          </button>
        )}
        {isDeleteLoading && <p>Loading ...</p>}
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
        <form method="dialog" onSubmit={handleEditCardDetail}>
          {/*----------------- Card Detail ------------------------ */}
          {updateFlashCardResult !== null && <p>{updateFlashCardResult}</p>}
          {isUpdateCardDetail && <p>Loading ... </p>}
          {!isEditingContent &&
            updateFlashCardResult === null &&
            !isUpdateCardDetail && (
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <label>Title :</label>
                  <input
                    type="text"
                    name="title"
                    className="m-2 border"
                    placeholder={recordData.title}
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label>Alt :</label>
                  <input
                    type="text"
                    name="description"
                    className="m-2 border"
                    placeholder={recordData.description}
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
                    name="upload"
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
            {!isEditingContent &&
              !isUpdateCardDetail &&
              updateFlashCardResult === null && <button>Save</button>}
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
