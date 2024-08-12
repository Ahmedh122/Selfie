import React from "react";
import PropTypes from "prop-types";
//import { cn } from "../../lib/utils";

function Button({ className = "", children, ...props }) {
  return (
    <button
      className={
        "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50" +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
