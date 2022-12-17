import Button from "@mui/material/Button";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function LikeButton({ liked, ...other }) {
  if (liked) {
    return (
      <Button
        variant="contained"
        color="green"
        endIcon={<ThumbUpIcon />}
        disableElevation
        {...other}
      >
        Liked
      </Button>
    );
  }

  return (
    <Button
      variant="outlined"
      color="grey"
      endIcon={<ThumbUpIcon />}
      disableElevation
      {...other}
    >
      Like
    </Button>
  );
}
