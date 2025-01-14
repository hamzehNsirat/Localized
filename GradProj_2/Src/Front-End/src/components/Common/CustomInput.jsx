import { Form } from "react-bootstrap";

const CustomInput = ({
  controlId,
  label,
  type = "text",
  className = "",
  value,
  onChange,
  placeholder = "",
  required,
  labelClassName = "",
  error = "", // Error message prop
  style = {},
  valid = null,
  ...props
}) => {
  const handleChange = (e) => {
    onChange(e); // Directly pass the event to parent handler
  };

  return (
    <Form.Group className={className} style={style}>
      {label && <Form.Label className={labelClassName}>{label}</Form.Label>}
      <Form.Control
        type={type}
        name={controlId} // Matches formData keys
        value={value || ""} // Ensure controlled input
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        isInvalid={!!error} // Highlight input field if there’s an error
        {...props}
        style={{
          borderRadius: "3px",
          height: "2.5rem",
          boxShadow: "none",
          borderWidth: valid === null ? "1px" : "2px",
          borderColor: valid === null ? "" : valid ? "lightgreen" : "red",
        }}
      />
      {error && (
        <Form.Text
          className="text-light my-0"
          style={{
            fontSize: "0.7rem",
            whiteSpace: "pre-wrap",
          }}
        >
          * {error}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default CustomInput;
