import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomInput = ({
  controlId,
  label,
  type = "text",
  className = "",
  disabled = false,
  value,
  onChange,
  style = {},
  placeholder = "",
  validators = [],
  formatOnChange = null,
  required,
}) => {
  const handleChange = (e) => {
    const { value } = e.target;

    // Apply formatting if a formatOnChange function is provided
    const formattedValue = formatOnChange ? formatOnChange(value) : value;

    // Pass formatted value to the onChange handler
    onChange({
      target: {
        name: controlId,
        value: formattedValue,
      },
    });
  };

  // Validate value based on validators and return error message
  const validate = () => {
    for (const validator of validators) {
      const validationResult = validator(value);
      if (!validationResult.isValid) {
        return validationResult.message;
      }
    }
    return null;
  };

  const validationError = validate();

  return (
    <Form.Group controlId={controlId} className={className} style={style}>
      <Form.Label className="fw-bold mb-0">{label}</Form.Label>
      <Form.Control
        required={required}
        type={type}
        name={controlId}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          height: "2.5rem",
          borderRadius: "3px",
          borderColor: validationError ? "red" : "",
          boxShadow: "none",
        }}
      />
      {validationError && (
        <Form.Text className="text-danger">{validationError}</Form.Text>
      )}
    </Form.Group>
  );
};

export default CustomInput;
