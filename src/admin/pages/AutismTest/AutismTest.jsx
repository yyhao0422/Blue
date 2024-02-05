import { useState, useRef } from "react";

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
import { Typography } from "@mui/material";

import ExistTest from "./ExistTest";
import {
  useFetchTestCategory,
  usePostTestCategory,
} from "../../hooks/useFetch";

function AutismTest() {
  const { isLoading, error, testCategory, setRefresh } = useFetchTestCategory();
  const {
    isLoading: isNewFlashCardLoading,
    error: newFlashCardError,
    setPostBody,
    response,
    setResponse,
  } = usePostTestCategory();
  const [open, setOpen] = useState(false);

  async function handleSubmitNewTest(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    const body = {
      title: data.title,
      description: data.description,
      autismTestQuestionIds: [],
    };
    setPostBody(JSON.stringify(body));
    e.target.reset();
  }

  if (response.ok) {
    setRefresh((prev) => !prev);
    setOpen(false);
    setResponse([]);
  }
  function handleNewTest() {
    setOpen(true);
  }

  function closeNewTest() {
    setOpen(false);
  }

  return (
    <>
      <div className=" p-3 h-fit m-3 rounded-md w-screen">
        <div className="flex justify-between">
          <Typography variant="h3" className="text-xl ">
            Autism Test Maintainance
          </Typography>
          <Button variant="contained" onClick={handleNewTest}>
            New Test category
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
                <TableCell className="p-2">Test ID</TableCell>
                <TableCell align="right" className="p-2">
                  Test Title
                </TableCell>
                <TableCell align="right" className="p-2">
                  Test Description
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
              {!isLoading &&
                testCategory.map((test) => (
                  <ExistTest
                    id={test.id}
                    title={test.title}
                    description={test.description}
                    question={test.question}
                    setRefresh={() => setRefresh((prev) => !prev)}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog
        open={open}
        onSubmit={handleSubmitNewTest}
        onClose={closeNewTest}
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle className="mt-2 mb-4">
          New Autism Test Category
        </DialogTitle>
        {/* {isNewFlashCardLoading && <p>Submit in progress ...</p>} */}

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
          <DialogActions>
            <Button type="submit">Save</Button>
            <Button type="button" onClick={closeNewTest}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AutismTest;
