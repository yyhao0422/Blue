import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useRef, useState } from "react";

function ExistCardContent({ question, refreshFlashCard, AdminId }) {
  const newContentTitle = useRef();
  const newImageSrc = useRef();
  const newSoundSrc = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

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
    setOpen(true);
  }
  function handleEditCloseModal() {
    setOpen(false);
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
      <TableBody>
        <TableRow>
          <TableCell className="mr-3 whitespace-nowrap">
            {question.id}
          </TableCell>

          <TableCell align="right">{question.question}</TableCell>
          <TableCell align="right">
            <img src={question.imageUrl} alt="card pic" className="w-10 mx-3" />
          </TableCell>
          <TableCell align="right" sx={{ maxWidth: "200px" }}>
            <p className="mx-3 overflow-hidden text-ellipsis">
              {question.soundUrl}
            </p>
          </TableCell>

          <TableCell align="right">
            <Button
              type=" button"
              className="mx-2"
              onClick={handleEditOpenModal}
            >
              Edit
            </Button>
            <Button
              type="button"
              className="
      mx-2"
              onClick={handleDeleteAction}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>

      <Dialog
        open={open}
        className="p-3"
        onSubmit={handleEditContent}
        onClose={handleEditCloseModal}
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle className="text-center">Edit Dialog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill the form to create a edit flash card.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Content Title"
            type="text"
            fullWidth
            variant="standard"
            placeholder={question.question}
            inputRef={newContentTitle}
          />

          <div className="flex justify-between items-center mt-10 mb-10">
            <label>
              <Typography>Image Src :</Typography>
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
                name="imageurl"
                id="imageUrl"
                ref={newImageSrc}
              />
            </Button>
          </div>
          <div className="flex justify-between items-center mb-10">
            <label>
              <Typography>Sound Src :</Typography>
            </label>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
              <VisuallyHiddenInput
                type="file"
                accept=".m4a,.mp3,.webm"
                required
                name="soundFile"
                id="soundFile"
                ref={newSoundSrc}
              />
            </Button>
          </div>

          <DialogActions>
            <Button type="submit">Save</Button>
            <Button type="button" onClick={handleEditCloseModal}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExistCardContent;
