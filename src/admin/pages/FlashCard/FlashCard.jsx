import { useRef, useState, useEffect, useContext } from "react";
import ExistRecord from "./ExistRecord";
import { AdminClerkContext } from "../../../store/admin-clerk-user-context";

function FlashCard() {
  const newFlashCardDialog = useRef();
  const [flashCardData, setFlashCardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNewFlashCardLoading, setIsNewFlashCardLoading] = useState(false);
  const [newFlashCardResult, setNewFlashCardResult] = useState("");
  const [refresh, setRefresh] = useState(false);
  const AdminClerkCtx = useContext(AdminClerkContext);
  const AdminId = AdminClerkCtx.user.id;

  useEffect(() => {
    async function fetchFlashCardData() {
      setIsLoading(true);
      if (AdminId !== undefined) {
        const headers = {
          "Content-Type": "application/json",
          ClerkId: AdminId,
        };
        try {
          const response = await fetch(
            "https://api.alexsama.tech/api/flash-card-category",
            { headers }
          );
          const resData = await response.json();
          if (!response.ok) {
            throw new Error("Failed to fetch Flash Card Data");
          }
          setFlashCardData(resData.data);
        } catch (error) {
          setError({
            message: error.message || "Failed to fetch Flash Crad Information",
          });
        }
      }
      setIsLoading(false);
    }
    fetchFlashCardData();
  }, [AdminId, refresh]);

  // Refresh Flash Card
  function refreshFlashCard() {
    setRefresh((prev) => !prev);
  }

  // New Button
  function handleNewFlashCard() {
    newFlashCardDialog.current.showModal();
  }

  function closeNewFlashCard() {
    newFlashCardDialog.current.close();
    setNewFlashCardResult("");
  }

  // Submit form
  async function saveNewFlashCard(event) {
    // Prevent Default Behavior form submit
    event.preventDefault();
    // Get Form data
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries()); // a min
    // Image Header
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

    console.log(imageFile);
    console.log(bodyImage);
    console.log(imageRequestOption);

    setIsNewFlashCardLoading(true);

    try {
      const responseUploadImages = await fetch(
        "https://api.alexsama.tech/api/upload-file",
        imageRequestOption
      );
      const resDataUploadImages = await responseUploadImages.json();

      if (!responseUploadImages.ok) {
        throw new Error("Failed to post FLash Card Images");
      }

      const response = await fetch(
        "https://api.alexsama.tech/api/flash-card-category",
        {
          method: "POST",
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            imageUrl: resDataUploadImages.data,
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
        throw new Error("Failed to fetch Flash Card Information");
      }
      if (resData.message === "success") {
        setNewFlashCardResult("Form submitted successfully ! ");
        refreshFlashCard();
      }
    } catch (error) {
      setNewFlashCardResult("Failed to submit form. Please try again !");
    }
    setIsNewFlashCardLoading(false);
  }

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
            {isLoading && <p>Loading</p>}
            {Object.keys(flashCardData).length !== 0 &&
              !isLoading &&
              flashCardData.map((recordData) => {
                return (
                  <ExistRecord
                    key={recordData.id}
                    recordData={recordData}
                    AdminId={AdminId}
                    refreshFlashCard={() => {
                      setRefresh((prev) => !prev);
                    }}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
      {/* ----------------New Dialog ---------------- */}
      <dialog ref={newFlashCardDialog} className="p-3 rounded-lg">
        <h1 className="mt-2 mb-4">New Flash Card</h1>
        {isNewFlashCardLoading && <p>Submit in progress ...</p>}
        {!isNewFlashCardLoading && newFlashCardResult === "" && (
          <form onSubmit={saveNewFlashCard}>
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <label>Title :</label>
                <input
                  type="text"
                  className="m-2 border"
                  required
                  name="title"
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Alt :</label>
                <input
                  type="text"
                  className="m-2 border"
                  required
                  name="description"
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Image Src :</label>
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg, .gif "
                  className="m-2 border"
                  required
                  name="upload"
                />
              </div>
            </div>
            <div className="flex justify-between m-3">
              <button>Save</button>
              <button type="button" onClick={closeNewFlashCard}>
                Close
              </button>
            </div>
          </form>
        )}
        {newFlashCardResult !== "" && (
          <div>
            <p>{newFlashCardResult}</p>
            <button onClick={closeNewFlashCard}>Close</button>
          </div>
        )}
      </dialog>
    </>
  );
}

export default FlashCard;
