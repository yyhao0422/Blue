import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import ExistCategory from "./ExistCategory";
import ExistVideo from "./ExistVideo";

function Video() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [openNewVideo, setOpenNewVideo] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [videoData, setVideoData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const titleRef = useRef();
  const descriptionRef = useRef();
  const videoTitleRef = useRef();
  const videoDescriptionRef = useRef();
  const videoURLRef = useRef();

  const headers = {
    Accept: "application/json",
    ClerkId: user?.id,
  };
  useEffect(() => {
    async function fetchVideoData() {
      try {
        const res = await fetch(
          `https://api.alexsama.tech/api/video-category`,
          {
            headers,
          }
        );
        const data = await res.json();
        const response = await fetch(`https://api.alexsama.tech/api/video`, {
          headers,
        });
        const videoData = await response.json();
        setVideoData(videoData.data);
        setCategoryData(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchVideoData();
  }, [user, refresh]);

  async function handleCreateVideo() {
    try {
      const res = await fetch(`https://api.alexsama.tech/api/video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ClerkId: user?.id,
        },
        body: JSON.stringify({
          title: videoTitleRef.current.value,
          description: videoDescriptionRef.current.value,
          videoUrl: videoURLRef.current.value,
        }),
      });
    } catch (error) {
      console.error(error);
    }
    setOpenNewVideo(false);
    setRefresh((prev) => !prev);
  }

  async function handleCreateVideoCategory() {
    try {
      const res = await fetch(`https://api.alexsama.tech/api/video-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ClerkId: user?.id,
        },
        body: JSON.stringify({
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          videoIDs: [],
        }),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    setOpen(false);
    setRefresh((prev) => !prev);
  }

  return (
    <>
      <div className="w-screen">
        <div className="p-5 ml-10">
          <Typography variant="h4">Video Maintainance</Typography>
        </div>
        <div>
          <div className="mb-20">
            <div className="p-5 ml-10 flex justify-between w-[1000px]  ">
              <Typography variant="h5">Video Category</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                Create New Category
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
                    <TableCell align="right" className="p-2">
                      Category Title
                    </TableCell>
                    <TableCell align="right" className="p-2">
                      Category Description
                    </TableCell>
                    <TableCell align="right" className="p-2">
                      Video IDs
                    </TableCell>
                    <TableCell align="right" className="p-2">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {Object.keys(categoryData).length !== 0 &&
                    categoryData.map((recordData) => {
                      return (
                        <ExistCategory
                          recordData={recordData}
                          refresh={() => setRefresh((prev) => !prev)}
                        />
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="p-5 ml-10  flex justify-between w-[1000px]">
            <Typography variant="h5">Video List</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenNewVideo(true)}
            >
              Create New Video
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
                  <TableCell align="left" className="p-2">
                    Video Id
                  </TableCell>
                  <TableCell align="left" className="p-2">
                    Video Title
                  </TableCell>
                  <TableCell align="left" className="p-2">
                    Video Description
                  </TableCell>
                  <TableCell align="left" className="p-2">
                    Video Url
                  </TableCell>
                  <TableCell align="left" className="p-2">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {Object.keys(videoData).length !== 0 &&
                  videoData.map((recordData) => {
                    return (
                      <ExistVideo
                        recordData={recordData}
                        refresh={() => setRefresh((prev) => !prev)}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create new category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter all the following data to create.
          </DialogContentText>
          <TextField
            autoFocus
            required
            inputRef={titleRef}
            margin="dense"
            id="title"
            name="title"
            label="TITLE"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            inputRef={descriptionRef}
            margin="dense"
            id="description"
            name="description"
            label="DESCRIPTION"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateVideoCategory} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openNewVideo} onClose={() => setOpenNewVideo(false)}>
        <DialogTitle>Create new video</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter all the following data to create.
          </DialogContentText>
          <TextField
            autoFocus
            required
            inputRef={videoTitleRef}
            margin="dense"
            id="videoTitle"
            name="videoTitle"
            label="TITLE"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            inputRef={videoDescriptionRef}
            margin="dense"
            id="description"
            name="description"
            label="DESCRIPTION"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            inputRef={videoURLRef}
            margin="dense"
            id="url"
            name="url"
            label="URL"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewVideo(false)}>Cancel</Button>
          <Button onClick={handleCreateVideo} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Video;
