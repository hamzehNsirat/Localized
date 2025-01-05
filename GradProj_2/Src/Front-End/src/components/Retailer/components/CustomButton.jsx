import { Button } from "react-bootstrap";

const CustomButton = ({ label, className, onClick, style = {} }) => {
  const defaultStyles = {
    height: "2.5rem",
    fontSize: "0.95rem",
    borderRadius: "4px",
  };

  const mergedStyles = { ...defaultStyles, ...style };

  return (
    <Button
      onClick={onClick}
      variant="dark"
      className={className}
      style={mergedStyles}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
