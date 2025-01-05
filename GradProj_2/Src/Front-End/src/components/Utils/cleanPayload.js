import { generateUpdatePayload } from "./updatePayload";

export const cleanUserPayload = (profileData, userData, imgUrl) => {
  const mapping = {
    firstName: "firstName",
    middleName: "middleName",
    lastName: "lastName",
    username: "userName",
    nationalNumber: "nationalNumber",
    dateOfBirth: "dateOfBirth",
    email: "userEmail",
    phoneNumber: "userPhone",
    address: "userAddress",
  };

  const payload = generateUpdatePayload(
    profileData,
    userData.userDetails,
    mapping
  );

  payload.userImage = imgUrl === false ? null : imgUrl;
  payload.userId = parseInt(localStorage.getItem("userId"));

  return payload;
};

export const cleanFactoryPayload = (estData, userData, coverUrl, logoUrl) => {
  const mapping = {
    companyName: "establishmentName",
    email: "establishmentEmail",
    regNum: "commercialRegistrationNum",
    desc: "establishmentDescription",
    website: "establishmentWebsite",
    phoneNumber: "contactNumber",
    regDate: "establishmentRegistrationDate",
    city: "establishmentCity",
    buildNo: "establishmentBuildingNum" ,
    street: "establishmentStreet" ,
    cover: "establishmentCover" ,
    logo: "establishmentLogo" ,
  };

  const payload = generateUpdatePayload(
    estData,
    userData.establishmentDetails,
    mapping
  );

    payload.establishmentLogo = logoUrl === false ? null : logoUrl;
    payload.establishmentCover = coverUrl === false ? null : coverUrl;
    payload.supplierId = parseInt(userData.supplierDetails.supplierId);

  return payload;
};

export const cleanSupplierPayload = (billData, userData) => {
  const mapping = {
    taxNum: "supplierTaxIdentificationNum",
    bankAccNum: "supplierBankAccountNum",
    iban: "supplierIban",
  };

  // Assume `supplierData` has the same structure for both new and existing data
  const payload = generateUpdatePayload(billData, userData.supplierDetails, mapping);
  payload.supplierId = parseInt(userData.supplierDetails.supplierId);
  payload.supplierUserId= null;


  return payload;
};


export const cleanRetailStorePayload = (estData, userData, logoUrl) => {
  const mapping = {
    companyName: "establishmentName",
    email: "establishmentEmail",
    regNum: "commercialRegistrationNum",
    desc: "establishmentDescription",
    website: "establishmentWebsite",
    phoneNumber: "contactNumber",
    regDate: "establishmentRegistrationDate",
    city: "establishmentCity",
    buildNo: "establishmentBuildingNum" ,
    street: "establishmentStreet" ,
    logo: "establishmentLogo" ,
  };

  const payload = generateUpdatePayload(
    estData,
    userData.establishmentDetails,
    mapping
  );

    payload.establishmentLogo = logoUrl === false ? null : logoUrl;
    payload.retailerId = parseInt(userData.retailerDetails.retailerId);

  return payload;
};

export const cleanRetailerPayload = (billData, userData) => {
  const mapping = {
    taxNum: "retailerTaxIdentificationNum",
    bankAccNum: "retailerBankAccountNum",
    iban: "retailerIban",
  };

  // Assume `retailerData` has the same structure for both new and existing data
  const payload = generateUpdatePayload(billData, userData.retailerDetails, mapping);
  payload.retailerId = parseInt(userData.retailerDetails.retailerId);
  payload.retailerUserId= null;


  return payload;
};