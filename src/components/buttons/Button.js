import React from "react";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const StyledButton = withStyles(theme => ({
  root: {
    borderRadius: "5px",
    fontColor: "white",
    color: "white",
    height: "40px",
    minWidth: "100px"
  }
}))(Button);

const CustomButton = ({ text, ...props }) => (
  <StyledButton variant="contained" color="primary" {...props}>
    {text}
  </StyledButton>
);

export default CustomButton;
