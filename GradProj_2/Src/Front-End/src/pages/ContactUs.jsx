import "bootstrap/dist/css/bootstrap.min.css";
import AppColors from "../components/Theme/AppColors";

const ContactUs = () => {
  return (
    <div
      className="h-100 py-4"
      style={{
        backgroundColor: AppColors.primaryColor,
        paddingInline: "100px",
      }}
    >
      <h1>Contact Us</h1>
      <p>This is the about page.</p>
    </div>
  );
};

export default ContactUs;
