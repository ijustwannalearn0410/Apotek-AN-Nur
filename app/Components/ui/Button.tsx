import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export default function Button({ 
  children, 
  isLoading, 
  loadingText = "Memproses...", 
  disabled, 
  ...props 
}: ButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      style={{
        padding: "10px 20px",
        cursor: (isLoading || disabled) ? "not-allowed" : "pointer",
        backgroundColor: (isLoading || disabled) ? "#ccc" : "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "5px",
        width: "100%",
        fontWeight: "bold"
      }}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}