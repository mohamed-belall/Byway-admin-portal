import React from "react";

const LoadingSpinner = ({ size = 25, color = "white" }) => {
  return (
    <div
      className="flex items-center  justify-center border-2 text-center font-bold  border-t-transparent rounded-full animate-spin"
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopColor: "transparent",
      }}
    >
   
    </div>
  );
};

export default LoadingSpinner;