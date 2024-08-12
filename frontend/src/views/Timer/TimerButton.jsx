import React from "react";
import PropTypes from "prop-types";
//import { TimerType } from "@/contexts/TimerContext";
import Button from "../../components/Button";

function TimerButton({ timerType, setTimerType, name, value }) {
  return (
    <Button
      className={`rounded-full px-4 py-3 ${
        timerType === value
          ? "bg-accent font-bold text-darkBlue"
          : "text-grayishBlue/40"
      }`}
      onClick={() => {
        setTimerType(value);
      }}
    >
      {name}
    </Button>
  );
}

TimerButton.propTypes = {
  //timerType: PropTypes.oneOf(Object.values(TimerType)).isRequired,
  setTimerType: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOf(Object.values(0/*TimerType*/)).isRequired,
};

export default TimerButton;