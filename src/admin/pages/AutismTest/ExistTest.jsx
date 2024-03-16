import { useEffect, useState, useRef } from "react";

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

import { useDeleteTestCategory } from "../../hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import ExistTestQuestion from "./ExistTestQuestion";

function ExistTest({ id, title, description, setRefresh }) {
  const newTitle = useRef();
  const newQuestion = useRef();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingNewContent, setIsLoadingNewContent] = useState(false);
  const [refresh, setRefreshQustion] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [isEditingContent, setisEditingContent] = useState(false);
  const { user } = useUser();
  const currentCategoryClient = axios.create({
    baseURL: `https://api.alexsama.tech/api/autism-test-category/`,
    headers: {
      "Content-Type": "application/json",
      ClerkId: user?.id,
    },
  });

  useEffect(() => {
    currentCategoryClient
      .get(`${id}`)
      .then((res) => {
        setQuestions(res.data.data);
      })
      .catch((error) => {
        setError({
          message: error.message || "Failed to fetch test question",
        });
      });
  }, [refresh, user]);

  async function handleNewContent() {
    setIsLoadingNewContent(true);
    try {
      const body = JSON.stringify({
        question: newTitle.current.value,
        description: newQuestion.current.value,
      });
      const response = await fetch(
        "https://api.alexsama.tech/api/autism-test-question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ClerkId: user?.id,
          },
          body: body,
        }
      );

      const resData = await response.json();

      const newQuestionId = resData.data.id;
      const prevQuestionId = questions.question.map((question) => question.id);

      const responseUpdateCategory = await fetch(
        "https://api.alexsama.tech/api/autism-test-category/" + id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ClerkId: user?.id,
          },
          body: JSON.stringify({
            title: title,
            description: description,
            autismTestQuestionIds: [...prevQuestionId, newQuestionId],
          }),
        }
      );
      console.log(responseUpdateCategory);
      setRefreshQustion((prev) => !prev);
    } catch (error) {
      console.log("err");
      setError({
        message: error.message || "Failed to add test question",
      });
    }
    setIsLoadingNewContent(false);
  }

  async function handleEditTest(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    const body = {
      title: data.title,
      description: data.description,
    };
    try {
      await currentCategoryClient.put(`${id}`, body);
    } catch (error) {
      setError({
        message: error.message || "Failed to edit test category",
      });
    }
    setRefresh();
  }

  function handleClickEditTest() {
    setOpen(true);
  }

  function closeEditFlashCard() {
    setOpen(false);
    setisEditingContent(false);
  }

  async function handleDeleteTest(id) {
    setIsDeleting(true);
    try {
      await currentCategoryClient.delete(`${id}`);
    } catch (error) {
      setError({
        message: error.message || "Failed to delete test category",
      });
    }

    setIsDeleting(false);
    setRefresh();
  }

  return (
    <>
      <TableRow>
        <TableCell align="right" className="p-2">
          {id}
        </TableCell>
        <TableCell align="right" className="p-2">
          {title}
        </TableCell>
        <TableCell align="right" className="p-2">
          {description}
        </TableCell>
        <TableCell align="right">
          <Button className="mx-2" onClick={handleClickEditTest}>
            Edit
          </Button>
          <Button className="mx-2" onClick={() => handleDeleteTest(id)}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <Dialog
        fullScreen
        maxWidth="xl"
        PaperProps={{
          component: "form",
        }}
        open={open}
        onSubmit={handleEditTest}
        onClose={closeEditFlashCard}
        className="p-3 rounded-lg"
      >
        <DialogTitle>Autism Test</DialogTitle>
        <div className="flex justify-around mb-3">
          <Typography
            className={`${!isEditingContent && "underline"} cursor-pointer`}
            onClick={() => {
              setisEditingContent(false);
            }}
          >
            Test Detail
          </Typography>
          <Typography
            className={`${isEditingContent && "underline"} cursor-pointer`}
            onClick={() => {
              setisEditingContent(true);
            }}
          >
            Test Content
          </Typography>
        </div>
        <DialogContent>
          {/*----------------- Card Detail ------------------------ */}
          {!isEditingContent && (
            <>
              <DialogContentText>
                Please fill in the form to edit the test category
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
                placeholder={title}
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
                placeholder={description}
              />
            </>
          )}
        </DialogContent>

        {isEditingContent && (
          <>
            <TableContainer sx={{ padding: 3 }} component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                className="m-3 "
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left">No</TableCell>
                    <TableCell align="left">Question</TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                {questions.question.map((question, index) => (
                  <ExistTestQuestion
                    id={question.id}
                    question={questions.question}
                    count={index + 1}
                    setRefresh={() => setRefreshQustion((prev) => !prev)}
                  />
                ))}
              </Table>
            </TableContainer>
            <DialogContent sx={{ minHeight: "200px" }}>
              <DialogTitle className="mr-3">New Question</DialogTitle>
              <DialogContentText>
                Please fill in the form to add new question
              </DialogContentText>
              <div className="flex justify-around">
                <TextField
                  sx={{ width: "25%", marginRight: " 20px" }}
                  autoFocus
                  required
                  margin="dense"
                  id="question"
                  name="question"
                  label="Question"
                  type="text"
                  fullWidth
                  variant="standard"
                  inputRef={newTitle}
                />
                <TextField
                  sx={{ width: "25%", marginRight: " 20px" }}
                  autoFocus
                  required
                  margin="dense"
                  id="description"
                  name="description"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="standard"
                  inputRef={newQuestion}
                />
                {isLoadingNewContent ? (
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

        {/*----------------- Card Content ------------------------ */}
        <div className="flex justify-between m-3">
          {!isEditingContent && <Button type="submit">Save</Button>}
          <Button type="button" onClick={closeEditFlashCard}>
            Close
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export default ExistTest;
