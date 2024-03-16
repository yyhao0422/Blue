import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
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

function ExistTestQuestion({ id, count, question, setRefresh }) {
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState({});
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [error, setError] = useState("");

  const currentQuestionClient = axios.create({
    baseURL: "https://api.alexsama.tech/api/autism-test-question/",
    headers: {
      "Content-Type": "application/json",
      ClerkId: user?.id,
    },
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  async function handleDeleteAction() {
    setIsLoadingDelete(true);
    try {
      const response = await currentQuestionClient.delete(`${id}`);
    } catch (err) {
      setError({
        message: err.message || "Failed to delete test question",
      });
    }
    setRefresh();
  }

  function openEditModel() {
    setOpen(true);
  }
  function closeEditModel() {
    setOpen(false);
  }

  async function handleEditAction(event) {
    event.preventDefault();
    console.log("edit");

    setIsLoadingEdit(true);

    const body = JSON.stringify({
      question: input.question,
      description: input.description,
    });
    try {
      const response = await fetch(
        "https://api.alexsama.tech/api/autism-test-question/" + id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ClerkId: user?.id,
          },
          body: body,
        }
      );
    } catch (err) {
      setError({
        message: err.message || "Failed to edit test question",
      });
    }
    setRefresh();
    setIsLoadingEdit(false);
    closeEditModel();
  }

  return (
    <>
      <TableBody>
        <TableRow>
          <TableCell className="mr-3 whitespace-nowrap">{count}</TableCell>
          <TableCell align="left">{question[count - 1].question}</TableCell>
          <TableCell align="left">{question[count - 1].description}</TableCell>
          <TableCell align="left">
            <Button type="button" className="mx-2" onClick={openEditModel}>
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
        onSubmit={handleEditAction}
        onClose={closeEditModel}
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle className="mt-2 mb-4 text-center bold">
          Edit Question No {count}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill the form to edit the question.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="question"
            name="question"
            label="Question"
            type="text"
            fullWidth
            variant="standard"
            placeholder={question[count - 1].question}
            onChange={handleChange}
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
            placeholder={question[count - 1].description}
            onChange={handleChange}
          />
          <DialogActions>
            <Button type="submit" onClick={handleEditAction}>
              Edit
            </Button>
            <Button type="button" onClick={closeEditModel}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExistTestQuestion;
