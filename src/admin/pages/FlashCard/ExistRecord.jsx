import { useEffect, useRef, useState, forwardRef } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Card, Typography } from "@mui/material";
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
  const [open, setOpen] = useState(false);

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

  async function handleNewContent(e) {
    setIsLoadingAddContent(true);
    console.log(e);
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
    setOpen(true);
  }

  function closeEditFlashCard() {
    setOpen(false);
    setUpdateFlashCardResult(null);
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

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

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
            <div className="text-right inline-block">
              <img
                src={recordData.imageUrl}
                alt={recordData.title}
                className="w-10 my-auto text-right"
              />
            </div>
          </TableCell>
          <TableCell align="right" className="p-2">
            {recordData.description}
          </TableCell>
          <TableCell align="right" className="p-2">
            <Button className="mx-2" onClick={handleEditFlashCard}>
              Edit
            </Button>
            {!isDeleteLoading && (
              <Button className="mx-2" onClick={handleDeleteFlashCard}>
                Delete
              </Button>
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
      <Dialog
        fullScreen
        open={open}
        onSubmit={handleEditCardDetail}
        onClose={closeEditFlashCard}
        maxWidth="xl"
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle>Flash Card</DialogTitle>
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
        <DialogContent>
          {/*----------------- Card Detail ------------------------ */}
          {updateFlashCardResult !== null && (
            <Typography className="p-3">{updateFlashCardResult}</Typography>
          )}
          {!isEditingContent &&
            updateFlashCardResult === null &&
            recordData !== null &&
            !isUpdateCardDetail && (
              <>
                <DialogContentText>
                  Please fill the form to edit the current flash card.
                </DialogContentText>

                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="title"
                  name="title"
                  label="Title"
                  type="text"
                  fullWidth
                  variant="standard"
                  placeholder={recordData.title}
                />

                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="description"
                  name="description"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="standard"
                  placeholder={recordData.description}
                />

                <div className="flex justify-between items-center">
                  <label>
                    <Typography>Image Src :</Typography>
                    <img
                      className="w-10"
                      alt="current pic"
                      src={recordData.imageUrl}
                    />
                  </label>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
                    <VisuallyHiddenInput
                      type="file"
                      accept=".png, .jpg, .jpeg, .gif "
                      required
                      name="upload"
                    />
                  </Button>
                </div>
              </>
            )}
        </DialogContent>

        {/*----------------- Card Content ------------------------ */}

        {isEditingContent && (
          <>
            {/* --------------------------Existing Card Content----------------------- */}
            <TableContainer sx={{ padding: 3 }} component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                className="m-3 "
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="right">ID</TableCell>
                    <TableCell align="right">Title</TableCell>
                    <TableCell align="right">Image</TableCell>
                    <TableCell align="right">Sound Src</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
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
              </Table>
            </TableContainer>
            {/* ------------------------------New Card Content------------------------------ */}
            <DialogContent sx={{ minHeight: "200px" }}>
              <DialogTitle className="mr-3">New Content</DialogTitle>
              <DialogContentText>
                Please fill the form to create a new flash card content.
              </DialogContentText>
              <div className="flex justify-around">
                <TextField
                  sx={{ width: "25%", marginRight: " 20px" }}
                  autoFocus
                  required
                  margin="dense"
                  id="title"
                  name="title"
                  label="Title"
                  type="text"
                  fullWidth
                  variant="standard"
                  inputRef={newContentTitle}
                />
                <div className="flex justify-between items-center">
                  <label>
                    <Typography sx={{ margin: "0 10px 0 10px" }}>
                      Image Src :
                    </Typography>
                  </label>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
                    <VisuallyHiddenInput
                      type="file"
                      accept=".png, .jpg, .jpeg, .gif "
                      required
                      name="imageUrl"
                      ref={newImageSrc}
                    />
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <label>
                    <Typography sx={{ margin: "0 10px 0 10px" }}>
                      Sound Src :
                    </Typography>
                  </label>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Sound
                    <VisuallyHiddenInput
                      type="file"
                      required
                      name="soundUrl"
                      ref={newUploadSound}
                    />
                  </Button>
                </div>

                {isLoadingAddContent ? (
                  <LoadingButton sx={{ width: 20 }} loading>
                    Loading ...
                  </LoadingButton>
                ) : (
                  <Button variant="outlined" onClick={handleNewContent}>
                    Create
                  </Button>
                )}
              </div>
            </DialogContent>
          </>
        )}
        <div className="flex justify-between m-3">
          {!isEditingContent &&
            !isUpdateCardDetail &&
            updateFlashCardResult === null && (
              <Button type="submit">Save</Button>
            )}
          <Button type="button" onClick={closeEditFlashCard}>
            Close
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export default ExistRecord;
