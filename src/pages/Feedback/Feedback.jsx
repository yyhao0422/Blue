import { Card, Typography } from "@mui/material";
import { useState, useRef } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useUser } from "@clerk/clerk-react";

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};
function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

function Feedback() {
  const [value, setValue] = useState(2); // rating value
  const [hover, setHover] = useState(-1);
  const [isSubmited, setIsSubmited] = useState(false); // [1]
  const { user } = useUser();
  const commentRef = useRef();
  const checkboxRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmitFeedback() {
    setIsLoading(true);
    try {
      const res = await fetch("https://api.alexsama.tech/api/users/details", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ClerkId: user.id,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await res.json();
      const response = await fetch("https://api.alexsama.tech/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          clerkId: user.id,
        },
        body: JSON.stringify({
          userSatisfactionScore: value,
          userId: data.data.id,
          comment: commentRef.current.value,
          userDeclaredBenefiting: checkboxRef.current.checked,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    setIsSubmited(true);
  }

  return (
    <div>
      <Card className="p-10">
        <form className="outline-dashed outline-2 outline-offset-2 rounded-lg p-3">
          {isSubmited && (
            <div className="mb-10 p-3">
              <h1 className="text-2xl font-bold mb-2">
                Thank you for your feedback !
              </h1>
              <p className="text-lg">
                We will use your feedback to improve our application.
              </p>
            </div>
          )}
          {!isSubmited && (
            <>
              <div className="mb-10 p-3">
                <h1 className="text-2xl font-bold mb-2">Feedback</h1>
                <p className="text-lg">
                  We would love to hear from you. Please share your feedback
                  with us.
                </p>
              </div>
              <div className="flex gap-10 ml-6     ">
                <Typography variant="h6" gutterBottom>
                  Satisfaction rating :
                </Typography>
                <Rating
                  name="hover-feedback"
                  value={value}
                  precision={0.5}
                  getLabelText={getLabelText}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
                {value !== null && (
                  <Box sx={{ ml: 2 }}>
                    {labels[hover !== -1 ? hover : value]}
                  </Box>
                )}
              </div>
              <div className="flex gap-10 mt-5 ">
                <div className="w-[500px] ml-6">
                  <Typography variant="h6" gutterBottom>
                    Does this app help you?
                  </Typography>
                </div>
                <div className="w-full">
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Yes"
                    inputRef={checkboxRef}
                  />
                </div>
              </div>
              <textarea
                className="w-full p-5 my-3 h-[250px] focus:outline-none focus:ring focus:border-blue-500 rounded-md"
                placeholder="Do you have any comment on this application ?"
                ref={commentRef}
              ></textarea>
              <div className="flex w-full justify-end">
                <Button
                  onClick={handleSubmitFeedback}
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Send
                </Button>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  );
}

export default Feedback;
