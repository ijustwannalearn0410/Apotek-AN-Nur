import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function InputField(props: InputFieldProps) {
  return (
    <input
      style={{
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "100%",
        boxSizing: "border-box" 
      }}
      {...props}
    />
  );
}