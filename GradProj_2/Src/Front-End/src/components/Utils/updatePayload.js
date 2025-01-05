export const generateUpdatePayload = (newData, existingData, mapping) => {
  const payload = {};

  Object.keys(mapping).forEach((key) => {
    const existingKey = mapping[key];
    if (newData[key] !== existingData[existingKey]) {
      payload[existingKey] = newData[key] === "" ? null : newData[key];
    }
  });
  return payload;
};

