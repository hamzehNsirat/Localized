const AnalyticsCard = ({
  bgColor,
  img,
  imgBgColor,
  label,
  data,
  isActive = false,
  value,
  onClick,
}) => {
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  return (
    <div
      className="d-flex flex-column px-3 py-3 align-items-start gap-2"
      style={{
        backgroundColor: bgColor,
        borderRadius: "10px",
        boxShadow: isActive
          ? `0px 0px 10px rgba(${hexToRgb(imgBgColor)}, 0.33)`
          : "", // Convert hex to rgba with opacity 0.33
        width: "20%",
        maxHeight: "calc(130px + 5%)",
      }}
      onClick={() => onClick(value)} // Use an arrow function here as well
    >
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: imgBgColor,
          height: "30px",
          width: "30px",
          borderRadius: "100%",
        }}
      >
        <img src={img} alt="img" style={{ width: "40%" }}></img>
      </div>
      <p className="my-0 fw-bold" style={{ fontSize: "0.95rem" }}>
        {data}
      </p>
      <p className="my-0" style={{ fontSize: "0.95rem" }}>
        {label}
      </p>
    </div>
  );
};

export default AnalyticsCard;
