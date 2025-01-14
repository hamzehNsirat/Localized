// const Analytics = require("../models/analytics"); // Replace with your actual model path
// const {executeQuery} = require("../config/database"); // Replace with your database config path

// describe("Analytics Model Integration Tests", () => { 
//   beforeAll(async () => {
//     // Clean up the database or set up initial data
//     await executeQuery("DELETE FROM analytics", []); // Optional: Clear table
//     await executeQuery(
//       `INSERT INTO analytics (product_id, trends, sales_count, views_count, capture_date)
//        VALUES ($1, $2, $3, $4, $5)`,
//       [1, { popularity: 85 }, 150, 300, "2024-01-01"]
//     );
//   });

//   afterAll(async () => {
//     // Optional: Cleanup after tests
//     await executeQuery("DELETE FROM analytics", []);
//   });


//   test("getAll should fetch all analytics records", async () => {
//     const obj = {
//       productId : 1};
//     const result = await Analytics.getByProduct(obj);
//     expect(result).toBeDefined();
//     expect(result.length).toBeGreaterThan(0);
//     expect(result[0]).toHaveProperty("out_trends", { popularity: 85 });
//     expect(result[0]).toHaveProperty("out_sales_count", 150);
//   });

//   test("insert should add a new analytics record", async () => {
//     const inputData = {
//       productId: 2,
//       trends: { popularity: 90 }, 
//       salesCount: 200,
//       viewsCount: 400,
//     };
//     const result = await Analytics.insert(inputData);

//     expect(result).toBeDefined();
//     const newRecord = await executeQuery(
//       "SELECT * FROM analytics WHERE product_id = $1",
//       [2]
//     );
//     expect(newRecord.length).toBeGreaterThan(0);
//     expect(newRecord[0].trends).toEqual(inputData.trends);
//   });

//   test("getByDate should fetch records within a date range", async () => {
//     const fromDate = "2024-01-01";
//     const toDate = "2024-12-31";

//     const result = await Analytics.getByDate(fromDate, toDate);
//     expect(result).toBeDefined();
//     expect(result.length).toBeGreaterThan(0); // Assuming only one record in this date range
//     expect(result[0]).toHaveProperty("out_product_id", "1");
//   });
// });
