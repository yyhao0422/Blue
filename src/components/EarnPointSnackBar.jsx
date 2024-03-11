import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
function EarnPointSnackBar({ message }) {
  const [open, setOpen] = useState(true);
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={() => setOpen(false)}
      message={message}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    />
  );
}

export default EarnPointSnackBar;
