import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";

function ExistCategory({ recordData, refresh }) {
  const { user } = useUser();
  const idRef = useRef();
  const [open, setOpen] = useState(false);

  async function handleAddVideoIds() {
    try {
      const res = await fetch(
        `https://api.alexsama.tech/api/video-category/${recordData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ClerkId: user?.id,
          },
          body: JSON.stringify({
            title: recordData.title,
            description: recordData.description,
            videoIds: [
              ...recordData.videos.map((video) => video.id),
              idRef.current.value,
            ],
          }),
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    setOpen(false);
    refresh();
  }

  async function handleDeleteVideoCategory() {
    try {
      const res = await fetch(
        `https://api.alexsama.tech/api/video-category/${recordData.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ClerkId: user?.id,
          },
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    refresh();
  }
  console.log(recordData);
  return (
    <>
      <TableRow key={recordData.id}>
        <TableCell align="right" className="p-2">
          {recordData.title}
        </TableCell>
        <TableCell align="right" className="p-2">
          {recordData.description}
        </TableCell>
        <TableCell align="right" className="p-2">
          {recordData.videos.map((video) => video.id + ",")}
        </TableCell>

        <TableCell align="right" className="p-2">
          <Button className="mx-2" onClick={() => setOpen(true)}>
            Add
          </Button>

          <Button className="mx-2" onClick={handleDeleteVideoCategory}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Video in category</DialogTitle>
        <DialogContent>
          <DialogContentText>Add video by entering VideoID</DialogContentText>
          <TextField
            autoFocus
            required
            inputRef={idRef}
            margin="dense"
            id="id"
            name="id"
            label="Video ID"
            type="text"
            fullWidth
            variant="standard"
          />
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddVideoIds}>Add</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExistCategory;
