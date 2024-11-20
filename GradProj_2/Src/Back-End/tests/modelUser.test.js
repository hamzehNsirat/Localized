// const userModel = require("../models/User"); // Replace with the actual path to your user model
// const { executeQuery } = require("../config/database");

// describe("User Model Integration Tests", () => {
//   let testUserId;

//   beforeAll(async () => { 
//     // Ensure the user table is clean or set up any necessary prerequisites
//     // await executeQuery("DELETE FROM user_localized", []);

//     // Insert initial test data if required
//     const result = await userModel.create({
//       nationalNumber: 7899008866, 
//       userType: 1,
//       userStatus: 1,
//       firstName: "John",
//       middleName: "Doe",
//       lastName: "Smith",
//       dateOfBirth: "1990-01-01",
//       userName: "johndoe87",
//       userAddress: "123 Main St",
//       userEmail: "john.doe7@example.com",
//       userPassword: "hashedpassword123",
//       userPassSalt: "somesalt",
//       isEmailVerified: true,
//       userPhoneNumber: '0787565148',
//       lastModifiedBy: 1,
//       userImage: null,
//     });
//     console.log(result[0].res);
//     testUserId = result[0].res; // Assuming the query returns the ID
//     err = 9;
//   });

//   afterAll(async () => {

    
//     // Cleanup after tests
//     // await executeQuery("DELETE FROM user_localized", []);
//   });

//   test("create should insert a new user", async () => {
//     const inputData = {
//       nationalNumber: 7056895125,
//       userType: 2,
//       userStatus: 2,
//       firstName: "Jane",
//       middleName: "A",
//       lastName: "Doe",
//       dateOfBirth: "1985-01-01",
//       userName: "janedoe44",
//       userAddress: "456 Another St",
//       userEmail: "jane78.doe@example.com",
//       userPassword: "hashedpassword456",
//       userPassSalt: "somesalt2",
//       isEmailVerified: false,
//       userPhoneNumber: '0789535600',
//       lastModifiedBy: 1,
//       userImage: null,
//     };

//     const result = await userModel.create(inputData);

//     expect(result).toBeDefined();
//     expect(result[0]).toHaveProperty("res"); // Assuming the response has 'res'
//   });

//   test("get should fetch user by ID", async () => {
//     const inputData = { userId: 4};

//     const result = await userModel.get(inputData);

//     expect(result).toBeDefined();
//     expect(result.length).toBeGreaterThan(0);
//     expect(result[0]).toHaveProperty("first_name", "Johnny");
//   });

//   test("update should modify an existing user", async () => {
//     const inputData = {
//       nationalNumber: null,
//       userType: 1,
//       userStatus: 1,
//       firstName: "Johnny",
//       middleName: "Doe",
//       lastName: "Smith",
//       dateOfBirth: "1990-01-01",
//       userName: "johndoe",
//       userAddress: "123 Main St",
//       userEmail: "dohn.doe@example.com",
//       userPassword: null,
//       userPassSalt:null,
//       isEmailVerified:null,
//       userPhoneNumber: null,
//       lastModifiedBy: 1,
//       userImage: null,
//       userId: 4,
//     };

//     const result = await userModel.update(inputData);

//     expect(result).toBeDefined();
//     expect(result[0]).toHaveProperty("res", 0); // Assuming 1 means successful update
//   });

//   test("delete should remove a user", async () => {
//     const inputData = { userId: testUserId };

//     const result = await userModel.delete(inputData);

//     expect(result).toBeDefined();
//     expect(result[0]).toHaveProperty("res", 0); // Assuming 1 means successful deletion
//   });

//   test("validate should check user login credentials", async () => {
//     const inputData = {
//       userName: "johndoe",
//       userEmail: "john.doe@example.com",
//       userPassword: "hashedpassword123",
//     };

//     const result = await userModel.validate(inputData);

//     expect(result).toBeDefined();
//     expect(result[0].res).not.toBe(-1);
//   });
// });
