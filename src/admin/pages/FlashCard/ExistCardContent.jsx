import { useRef, useState } from "react";

function ExistCardContent({ question, refreshFlashCard, AdminId }) {
  const editDialog = useRef();
  const newContentTitle = useRef();
  const newImageSrc = useRef();
  const newSoundSrc = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [error, setError] = useState(null);

  console.log(question);

  async function handleEditContent(event) {
    event.preventDefault();

    setIsLoading(true);
    const imageFd = new FormData();
    imageFd.append("upload", newImageSrc.current.files[0]);
    imageFd.append("dirname", "Images");
    const soundFd = new FormData();
    soundFd.append("upload", newSoundSrc.current.files[0]);
    soundFd.append("dirname", "Images");
    const fileUploadHeaders = new Headers();
    fileUploadHeaders.append("ClerkId", AdminId);
    fileUploadHeaders.append("Accept", "application/json");

    try {
      const responseUploadImage = await fetch(
        "https://api.alexsama.tech/api/upload-file",
        {
          method: "POST",
          body: imageFd,
          headers: fileUploadHeaders,
        }
      );

      const resDataImage = await responseUploadImage.json();

      if (!responseUploadImage.ok) {
        throw new Error("Fail to add Images files !");
      }

      const responseUploadSound = await fetch(
        "https://api.alexsama.tech/api/upload-file",
        {
          method: "POST",
          body: soundFd,
          headers: fileUploadHeaders,
        }
      );

      const resDataSound = await responseUploadSound.json();

      if (!responseUploadSound.ok) {
        throw new Error("Fail to add Sound File");
      }

      console.log(
        JSON.stringify({
          question: newContentTitle.current.value,
          answer: newContentTitle.current.value,
          imageUrl: resDataImage.data,
          soundUrl: resDataSound.data,
        })
      );
      const responseUploadQuestion = await fetch(
        `https://api.alexsama.tech/api/flash-card-question/${question.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            question: newContentTitle.current.value,
            answer: newContentTitle.current.value,
            imageUrl: resDataImage.data,
            soundUrl: resDataSound.data,
          }),
          headers: {
            ClerkId: AdminId,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const resDataQuestion = await responseUploadQuestion.json();

      if (!responseUploadImage.ok) {
        throw new Error("Fail to upload Question");
      } else {
        refreshFlashCard();
      }
    } catch (error) {
      setError({
        message: error.message || `Fail to add Flash Card Content !`,
      });
    }

    setIsLoading(false);
    handleEditCloseModal();
  }
  async function handleDeleteAction() {
    setIsLoadingDelete(true);
    try {
      const response = await fetch(
        `https://api.alexsama.tech/api/flash-card-question/${question.id}`,
        {
          method: "DELETE",
          headers: {
            ClerkId: AdminId,
            Accept: "application/json",
          },
        }
      );
      const resData = await response.json();

      if (!response.ok) {
        throw new Error("Fail to delete selected card content !");
      } else {
        refreshFlashCard();
      }
    } catch (error) {
      setError({
        message: error.message || `Fail to add Flash Card Content !`,
      });
    }
    setIsLoadingDelete(false);
  }

  function handleEditOpenModal() {
    editDialog.current.showModal();
  }
  function handleEditCloseModal() {
    editDialog.current.close();
  }

  return (
    <>
      <div className="flex justify-between items-center my-2 ">
        <h1 className="mr-3 whitespace-nowrap">ContentID {question.id} :</h1>
        <div className="flex w-full border py-2 px-2 rounded-md">
          <div className="flex items-center mx-2 w-1/3">
            <label className="text-nowrap">Content Title :</label>
            <p className="mx-3">{question.question}</p>
          </div>
          <div className="flex items-center mx-2 w-1/3">
            <label className="text-nowrap">Image URL :</label>
            <img src={question.imageUrl} className="w-10 mx-3" />
          </div>
          <div className="flex items-center mx-2 w-1/3">
            <label className="text-nowrap">Sound Src:</label>
            <p className="mx-3 overflow-hidden text-ellipsis">
              {question.soundUrl}
            </p>
          </div>
        </div>
        <button type=" button" className="mx-2" onClick={handleEditOpenModal}>
          Edit
        </button>
        <button
          type="button"
          className="
      mx-2"
          onClick={handleDeleteAction}
        >
          Delete
        </button>
      </div>
      <dialog ref={editDialog} className="p-3">
        <h1 className="text-center">Edit Dialog</h1>
        <form method="dialog">
          <div className="flex flex-col justify-between items-center my-2">
            <div className=" flex flex-col bg-cyan-300 py-1 px-2 rounded-md">
              <div>
                <label htmlFor="title">Content Title :</label>

                <input
                  id="title"
                  name="title"
                  placeholder={question.question}
                  ref={newContentTitle}
                  type="text"
                  className="m-2 border"
                  required
                />
              </div>

              <div>
                <label htmlFor="imageUrl">Image src :</label>
                <input
                  id="imageUrl"
                  name="imageurl"
                  ref={newImageSrc}
                  type="file"
                  className="m-2 border"
                  required
                />
              </div>

              <div>
                <label htmlFor="soundFile">Upload Sound :</label>
                <input
                  id="soundFile"
                  name="soundFile"
                  ref={newSoundSrc}
                  type="file"
                  accept=".m4a,.mp3,.webm"
                  className="m-2 border"
                  required
                />
              </div>
            </div>
            <button type="button" onClick={handleEditContent}>
              Save
            </button>
            <button type="button" onClick={handleEditCloseModal}>
              Close
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default ExistCardContent;
