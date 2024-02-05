import { useRef, useState, useEffect, useContext } from "react";
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
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import ExistRecord from "./ExistRecord";
import { AdminClerkContext } from "../../../store/admin-clerk-user-context";
import { Typography } from "@mui/material";

function FlashCard() {
  const [flashCardData, setFlashCardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNewFlashCardLoading, setIsNewFlashCardLoading] = useState(false);
  const [newFlashCardResult, setNewFlashCardResult] = useState("");
  const [refresh, setRefresh] = useState(false);
  const AdminClerkCtx = useContext(AdminClerkContext);
  const AdminId = AdminClerkCtx.user.id;
  const [open, setOpen] = useState(false);

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
    setOpen(true);
  }

  function closeNewFlashCard() {
    setOpen(false);
    setNewFlashCardResult("");
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
      <div className=" p-3 h-fit m-3 rounded-md w-screen">
        <div className="flex justify-between">
          <h1 className="text-xl text-bold text-center m-3">
            Flash Card Maintainance
          </h1>
          <Button variant="contained" onClick={handleNewFlashCard}>
            New Flashcard
          </Button>
        </div>

        <TableContainer sx={{ padding: 3 }} component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            aria-label="simple table"
            className="m-3 "
          >
            <TableHead>
              <TableRow>
                <TableCell className="p-2">Flash Card ID</TableCell>
                <TableCell align="right" className="p-2">
                  Flash Card Title
                </TableCell>
                <TableCell align="right" className="p-2">
                  Image Src
                </TableCell>
                <TableCell align="right" className="p-2">
                  Alt
                </TableCell>
                <TableCell align="right" className="p-2">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading && (
                <LoadingButton sx={{ width: 20 }} loading>
                  Loading ...
                </LoadingButton>
              )}
              {Object.keys(flashCardData).length !== 0 &&
                !isLoading &&
                flashCardData.map((recordData) => {
                  return (
                    <ExistRecord
                      key={recordData.id}
                      recordDataId={recordData.id}
                      AdminId={AdminId}
                      refreshParentFlashCard={() => {
                        setRefresh((prev) => !prev);
                      }}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* ----------------New Dialog ---------------- */}
      <Dialog
        className="p-3 rounded-lg"
        open={open}
        onSubmit={saveNewFlashCard}
        onClose={closeNewFlashCard}
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle>New Flash Card</DialogTitle>
        {isNewFlashCardLoading && (
          <LoadingButton loading>Loading ...</LoadingButton>
        )}
        {!isNewFlashCardLoading && newFlashCardResult === "" && (
          <DialogContent>
            <DialogContentText>
              Please fill the form to create a new flash card.
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
            />
            {/* <Button
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
            </Button> */}

            <div className="flex justify-between items-center">
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
                  name="upload"
                />
              </Button>
            </div>

            <DialogActions>
              <Button type="submit">Save</Button>
              <Button type="button" onClick={closeNewFlashCard}>
                Close
              </Button>
            </DialogActions>
          </DialogContent>
        )}
        {newFlashCardResult !== "" && (
          <div>
            <p>{newFlashCardResult}</p>
            <button onClick={closeNewFlashCard}>Close</button>
          </div>
        )}
      </Dialog>
    </>
  );
}

export default FlashCard;
