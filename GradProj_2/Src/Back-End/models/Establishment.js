// Establishment Model
const executeQuery = require("../config/database"); // Database connection

const Establishment = {
  async getAllEstablishments() {
    return await executeQuery("SELECT * FROM establishment_get_all()", []);
  },

  async getEstablishmentById(establishmentId) {
    return await executeQuery("SELECT * FROM establishment_get_by_id($1)", [
      establishmentId,
    ]);
  },

  async getEstablishmentByCommercialRegNum(commercialRegNum) {
    return await executeQuery(
      "SELECT * FROM establishment_get_by_commercial_reg_num($1)",
      [commercialRegNum]
    );
  },

  async getEstablishmentByIndustryType(industryTypes) {
    return await executeQuery(
      "SELECT * FROM establishment_get_by_industry_type($1)",
      [industryTypes]
    );
  },

  async insertEstablishment(inputData) {
    return await executeQuery(
      "SELECT * FROM establishment_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)",
      [
        inputData.establishmentStatus,
        inputData.industryType,
        inputData.establishmentName,
        inputData.commercialRegistrationNum,
        inputData.establishmentRegistrationDate,
        inputData.contactNumber,
        inputData.establishmentEmail,
        inputData.establishmentWebsite,
        inputData.establishmentDescription,
        inputData.establishmentType,
        inputData.establishmentCity,
        inputData.establishmentStreet,
        inputData.establishmentBuildingNum,
        inputData.establishmentLogo,
        inputData.establishmentCover,
        inputData.estComplianceIndicator,
        inputData.estComplianceIndicatorDesc,
        inputData.lastModifiedBy,
      ]
    );
  },

  async updateEstablishment(establishmentId, inputData) {
    return await executeQuery(
      "SELECT * FROM establishment_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)",
      [
        establishmentId,
        inputData.establishmentStatus,
        inputData.industryType,
        inputData.establishmentName,
        inputData.commercialRegistrationNum,
        inputData.establishmentRegistrationDate,
        inputData.contactNumber,
        inputData.establishmentEmail,
        inputData.establishmentWebsite,
        inputData.establishmentDescription,
        inputData.establishmentCity,
        inputData.establishmentStreet,
        inputData.establishmentBuildingNum,
        inputData.establishmentLogo,
        inputData.establishmentCover,
        inputData.estComplianceIndicator,
        inputData.estComplianceIndicatorDesc,
        inputData.lastModifiedBy,
      ]
    );
  },

  async deleteEstablishment(establishmentId, lastModifiedBy) {
    return await executeQuery("SELECT * FROM establishment_delete($1, $2)", [
      establishmentId,
      lastModifiedBy,
    ]);
  },
};

module.exports = Establishment;
