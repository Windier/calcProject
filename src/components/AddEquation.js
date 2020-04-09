import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px"
  }
});

export default function AddEquation(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();

  function handleClick(event) {
    props.addNewObjectHandler();
    // setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    props.addNewObjectHandler();
    setAnchorEl(null);
  }

  return (
    <div>
      <div>
        <Button
          className={classes.root}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          Add Equation
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Curve</MenuItem>
          <MenuItem onClick={handleClose}>Surface</MenuItem>
          <MenuItem onClick={handleClose}>Vector Field</MenuItem>
        </Menu>
      </div>
    </div>
  );
}
