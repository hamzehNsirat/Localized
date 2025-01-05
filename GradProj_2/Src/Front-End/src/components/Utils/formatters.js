export const formatDateForInput = (isoDate) => {
  if (!isoDate) return ""; // Handle null or undefined values
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
  return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
};
