import { useEffect, useRef, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { LoadingButton } from "@mui/lab";

import ExistCardContent from "./ExistCardContent";

function ExistRecord({ recordDataId, AdminId, refreshParentFlashCard }) {
  const [refreshCardContent, setRefreshCardContent] = useState(false);
  const [isEditingContent, setisEditingContent] = useState(false);
  const [isDeleteLoading, setIsDeleletLoading] = useState(false);
  const [recordData, setRecordData] = useState({});
  const [isLoadingGetCategoryData, setIsLoadingGetCategoryData] =
    useState(false);
  const [isUpdateCardDetail, setIsUpdateCardDetail] = useState(false);
  const [isLoadingAddContent, setIsLoadingAddContent] = useState(false);
  const [statusAddNewContent, setStatusAddNewContent] = useState(null);
  const [updateFlashCardResult, setUpdateFlashCardResult] = useState(null);
  const [error, setError] = useState("");

  const editFlashCardDialog = useRef();

  // New Card Content reference hook
  const newContentTitle = useRef();
  const newImageSrc = useRef();
  const newUploadSound = useRef();

  useEffect(() => {
    async function fetchCurrentCateroryRecordData() {
      setIsLoadingGetCategoryData(true);
      try {
        const response = await fetch(
          `https://api.alexsama.tech/api/flash-card-category/${recordDataId}`,
          {
            headers: {
              ClerkId: AdminId,
              Accept: "application/json",
            },
          }
        );
        const resData = await response.json();
        console.log(resData);
        setRecordData(resData.data);
        if (!response.ok) {
          throw new Error("Fail to fetch current category");
        }
      } catch (error) {
        setError({
          message: error.message || `Fail to fetch Current Category Item !`,
        });
      }
      setIsLoadingGetCategoryData(false);
    }
    fetchCurrentCateroryRecordData();
  }, [recordDataId, refreshCardContent]);

  if (recordData !== null) console.log(recordData);

  function refreshFlashCard() {
    setRefreshCardContent((prev) => !prev);
  }

  async function handleNewContent() {
    setIsLoadingAddContent(true);
    const imageFd = new FormData();
    imageFd.append("upload", newImageSrc.current.files[0]);
    imageFd.append("dirname", "Images");
    const soundFd = new FormData();
    soundFd.append("upload", newUploadSound.current.files[0]);
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
        "https://api.alexsama.tech/api/flash-card-question",
        {
          method: "POST",
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
      }

      //Get Previous Question ID
      const questionIds = [];
      recordData.question.map((question) => {
        questionIds.push(question.id);
      });

      //Add new Question ID into Previous ID

      questionIds.push(resDataQuestion.data.id);

      const responseUpdateCategory = await fetch(
        `https://api.alexsama.tech/api/flash-card-category/${recordData.id}`,
        {
          method: "PUT",
          headers: {
            ClerkId: AdminId,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: recordData.title,
            description: recordData.description,
            imageUrl: recordData.imageUrl,
            flashCardQuestionIds: questionIds,
          }),
        }
      );

      if (!responseUpdateCategory) {
        throw new Error("Fail to update category!");
      }

      const resDataUpdateCategory = await responseUpdateCategory.json();

      if (responseUpdateCategory) {
        setStatusAddNewContent("Successfully Added");
        refreshFlashCard();
      }
    } catch (error) {
      setError({
        message: error.message || `Fail to add Flash Card Content !`,
      });
    }
    setIsLoadingAddContent(false);
  }

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
    refreshParentFlashCard();
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
    <>
      {isLoadingGetCategoryData && (
        <tr>
          <td>
            <LoadingButton sx={{ width: 20 }} loading>
              Loading ...
            </LoadingButton>
          </td>
        </tr>
      )}
      {!isLoadingGetCategoryData && (
        <TableRow>
          <TableCell align="right" className="p-2">
            {recordData.id}
          </TableCell>
          <TableCell align="right" className="p-2">
            {recordData.title}
          </TableCell>
          <TableCell align="right" className="p-2">
            <img src={recordData.imageUrl} className="w-10" />
          </TableCell>
          <TableCell align="right" className="p-2">
            {recordData.description}
          </TableCell>
          <TableCell align="right" className="p-2">
            <button className="mx-2" onClick={handleEditFlashCard}>
              Edit
            </button>
            {!isDeleteLoading && (
              <button className="mx-2" onClick={handleDeleteFlashCard}>
                Delete
              </button>
            )}
            {isDeleteLoading && (
              <LoadingButton sx={{ width: 20 }} loading>
                Loading ...
              </LoadingButton>
            )}
          </TableCell>
          {/* ----------------Edit Dialog ---------------- */}
        </TableRow>
      )}
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

          {!isEditingContent &&
            updateFlashCardResult === null &&
            recordData !== null &&
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
            <>
              {/* --------------------------Existing Card Content----------------------- */}
              <div className="flex flex-col">
                {recordData.question?.map((question) => {
                  return (
                    <ExistCardContent
                      index={question.id}
                      question={question}
                      refreshFlashCard={refreshFlashCard}
                      AdminId={AdminId}
                    />
                  );
                })}
              </div>
              {/* ------------------------------New Card Content------------------------------ */}
              <div className="flex justify-between items-center my-2">
                <h1 className="mr-3">New Content</h1>
                <div className="bg-cyan-300 py-1 px-2 rounded-md">
                  <label htmlFor="title">Content Title :</label>
                  <input
                    id="title"
                    ref={newContentTitle}
                    type="text"
                    className="m-2 border"
                    required
                  />
                  <label htmlFor="imageUrl">Image src :</label>
                  <input
                    ref={newImageSrc}
                    id="imageUrl"
                    type="file"
                    className="m-2 border"
                    required
                  />
                  <label htmlFor="soundFile">Upload Sound :</label>
                  <input
                    ref={newUploadSound}
                    id="soundFile"
                    type="file"
                    accept=".m4a,.mp3,.webm"
                    className="m-2 border"
                    required
                  />
                </div>
                <i
                  className="mx-2 cursor-pointer hover:bg-gray-300 rounded-[50px]"
                  onClick={handleNewContent}
                >
                  <svg
                    width="40px"
                    height="40px"
                    viewBox="0 -0.5 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.5 12.5L10.167 17L19.5 8"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </i>
              </div>
            </>
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
    </>
  );
}

export default ExistRecord;
