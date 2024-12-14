const { executeQuery } = require("../config/database");
const analyticsService = {
  // Processes data analytics for dashboards Display
  // Retailer Part
  async getRetailerAnalytics(userId) {
    const retailerId = await await executeQuery(
      `SELECT 
    retailer_id
    FROM 
    retailer    
    WHERE 
    retailer_user_id = $1;`,
      [userId]
    );
    if (!retailerId) {
      return { success: false };
    }

    const quotationsCount = await executeQuery(
      `SELECT 
    COUNT(quotation_id) AS quotations_count
    FROM 
    quotation
    WHERE 
    requester_id = $1;`,
      [retailerId[0].retailer_id]
    );
    const totalSpent = await executeQuery(
      `SELECT 
        SUM(total) AS total_spent
    FROM 
        quotation
    WHERE 
        requester_id = $1 AND quotation_status_id = (SELECT quotation_status_id FROM quotation_status WHERE quotation_status LIKE '%COMPLETED%');`,
      [retailerId[0].retailer_id]
    );

    const expectedProfitAllTime = await executeQuery(
      `SELECT 
    SUM(
        (p.product_retail_price - (details->>'price')::NUMERIC) * (details->>'quantity')::NUMERIC
    ) AS total_expected_profit
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    JOIN 
        product p ON (details->>'productId')::INT = p.product_id
    WHERE 
        q.quotation_status_id IN (3, 4)
        AND q.requester_id = $1;`,
      [retailerId[0].retailer_id]
    );

    const expectedProfitThreeMnths = await executeQuery(
      `SELECT 
        SUM(
            (p.product_retail_price - (details->>'price')::NUMERIC) * (details->>'quantity')::NUMERIC
        ) AS total_expected_profit
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    JOIN 
        product p ON (details->>'productId')::INT = p.product_id
    WHERE 
        q.quotation_status_id IN (3, 4)
    AND q.requester_id = $1   AND q.quotation_request_date >= CURRENT_DATE - INTERVAL '3 months';`,
      [retailerId[0].retailer_id]
    );

    const expectedProfitSixMnths = await executeQuery(
      `SELECT 
    SUM(
        (p.product_retail_price - (details->>'price')::NUMERIC) * (details->>'quantity')::NUMERIC
    ) AS total_expected_profit
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    JOIN 
        product p ON (details->>'productId')::INT = p.product_id
    WHERE 
        q.quotation_status_id IN (3, 4)
    AND q.requester_id = $1   AND q.quotation_request_date >= CURRENT_DATE - INTERVAL '6 months';`,
      [retailerId[0].retailer_id]
    );

    const expectedProfitNineMnths = await executeQuery(
      `SELECT 
        SUM(
            (p.product_retail_price - (details->>'price')::NUMERIC) * (details->>'quantity')::NUMERIC
        ) AS total_expected_profit
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    JOIN 
        product p ON (details->>'productId')::INT = p.product_id
    WHERE 
        q.quotation_status_id IN (3, 4)
    AND q.requester_id = $1   AND q.quotation_request_date >= CURRENT_DATE - INTERVAL '9 months';`,
      [retailerId[0].retailer_id]
    );

    const issuesReportedObj = await executeQuery(
      `WITH complaints_data AS (
    SELECT
        COUNT(*) AS total_complaints,
        COUNT(*) FILTER (WHERE complaint_status_id = 'RESOLVED') AS resolved_complaints,
        COUNT(*) FILTER (WHERE complaint_status_id = 'RESOLVED' AND is_penalty_resulted = true) AS penalty_complaints,
        COUNT(*) FILTER (WHERE complaint_status_id = 'RESOLVED' AND is_penalty_resulted = false) AS resolved_no_penalty_complaints
    FROM
        complaint
    WHERE
        submitter_type = false
        AND retailer_id = $1
    )
    SELECT
        total_complaints,
        (resolved_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1  END) AS percentage_resolved,
        (penalty_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1 END) AS percentage_penalty,
        (resolved_no_penalty_complaints * 100.0 / CASE WHEN resolved_complaints <> 0 THEN resolved_complaints ELSE 1 END) AS percentage_resolved_no_penalty
    FROM
    complaints_data;
    `,
      [retailerId[0].retailer_id]
    );

    const complianceIndicator = await executeQuery(
      `SELECT est_compliance_indicator 
    FROM establishment 
    WHERE establishment_id = (SELECT retailstore_est_id FROM retailstore WHERE owner_id = $1);
    `,
      [retailerId[0].retailer_id]
    );

    const quotationsParticipatedOneYr = await executeQuery(
      `SELECT
        COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
    FROM
        quotation
    WHERE
        requester_id = $1
    AND quotation_request_date >= CURRENT_DATE - INTERVAL '1 year';
    `,
      [retailerId[0].retailer_id]
    );

    const quotationsParticipatedNineMnths = await executeQuery(
      `SELECT
        COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
    FROM
        quotation
    WHERE
        requester_id = $1
	AND quotation_request_date >=  CURRENT_DATE - INTERVAL '9 month';
    `,
      [retailerId[0].retailer_id]
    );
    const quotationsParticipatedSixMnths = await executeQuery(
      `SELECT
        COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
    FROM
        quotation
    WHERE
        requester_id = $1
	AND quotation_request_date >=  CURRENT_DATE - INTERVAL '6 month';
    `,
      [retailerId[0].retailer_id]
    );
    const quotationsParticipatedThreeMnths = await executeQuery(
      `SELECT
        COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
    FROM
        quotation
    WHERE
        requester_id = $1
	AND quotation_request_date >=  CURRENT_DATE - INTERVAL '3 month';
    `,
      [retailerId[0].retailer_id]
    );

    const purchasesList = await executeQuery(
      `SELECT 
    quotation_id,
    to_establishment_name,
    total,
    (total * 100.0 / SUM(total) OVER ()) AS percentage_of_total 
    FROM 
        quotation
    WHERE 
        requester_id = $1 
        AND quotation_status_id IN (3, 4) AND total IS NOT NULL
    ORDER BY 
        percentage_of_total DESC
    LIMIT 10;
    `,
      [retailerId[0].retailer_id]
    );

    const productsTopThreeList = await executeQuery(
      `WITH product_mentions AS (
    SELECT 
        details->>'productId' AS product_id,
        COUNT(*) AS mention_count
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    WHERE 
        q.requester_id = $1
    GROUP BY 
        details->>'productId'
    ),
    product_sales AS (
        SELECT 
            details->>'productId' AS product_id,
            COUNT(*) AS sales_count
        FROM 
            quotation q
        CROSS JOIN LATERAL 
            jsonb_array_elements(q.quotation_details->'detailsItem') details
        WHERE 
            q.requester_id = $1
            AND q.quotation_status_id IN (3, 4) -- Status: Confirmed or Completed
        GROUP BY 
            details->>'productId'
    ),
    top_products AS (
        SELECT 
            pm.product_id,
            pm.mention_count,
            ps.sales_count,
            (ps.sales_count * 100.0 / NULLIF(pm.mention_count, 0)) AS sales_percentage
        FROM 
            product_mentions pm
        LEFT JOIN 
            product_sales ps ON pm.product_id = ps.product_id
        ORDER BY 
            pm.mention_count DESC
        LIMIT 3
    )
    SELECT 
        tp.product_id::INT,
        p.product_name,
        tp.mention_count,
        tp.sales_count,
        COALESCE(tp.sales_percentage, 0) AS sales_percentage
    FROM 
        top_products tp
    LEFT JOIN 
        product p ON tp.product_id::INT = p.product_id;
    `,
      [retailerId[0].retailer_id]
    );

    const categoriesTopThreeList = await executeQuery(
      `WITH category_mentions AS (
    SELECT 
        (details->>'productCategory')::VARCHAR AS category_name,
        COUNT(*) AS mention_count
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    WHERE 
        q.requester_id = $1
    GROUP BY 
        (details->>'productCategory')::VARCHAR
    ),
    category_sales AS (
        SELECT 
            (details->>'productCategory')::VARCHAR AS category_name,
            COUNT(*) AS sales_count
        FROM 
            quotation q
        CROSS JOIN LATERAL 
            jsonb_array_elements(q.quotation_details->'detailsItem') details
        WHERE 
            q.requester_id = $1 
            AND q.quotation_status_id IN (3, 4)
        GROUP BY 
            (details->>'productCategory')::VARCHAR
    ),
    top_categories AS (
        SELECT 
            cm.category_name,
            cm.mention_count,
            cs.sales_count,
            (cs.sales_count * 100.0 / NULLIF(cm.mention_count, 0)) AS sales_percentage
        FROM 
            category_mentions cm
        LEFT JOIN 
            category_sales cs ON cm.category_name = cs.category_name
        ORDER BY 
            cm.mention_count DESC
        LIMIT 3
    )
    SELECT 
        tc.category_name,
        tc.mention_count,
        tc.sales_count,
        COALESCE(tc.sales_percentage, 0) AS sales_percentage
    FROM 
        top_categories tc;
    `,
      [retailerId[0].retailer_id]
    );

    const purchaseList = { purchaseItem: [] };
    for (let i = 0; i < purchasesList.length; i++) {
      const item = {
        id: purchasesList[i].quotation_id,
        name: purchasesList[i].to_establishment_name,
        total: purchasesList[i].total,
        share: parseFloat(purchasesList[i].percentage_of_total ?? 0).toFixed(2),
      };
      purchaseList.purchaseItem.push(item);
    }

    const topThreeProducts = { productItem: [] };
    for (let i = 0; i < productsTopThreeList.length; i++) {
      const item = {
        id: productsTopThreeList[i].product_id,
        name: productsTopThreeList[i].product_name,
        mentions: productsTopThreeList[i].mention_count,
        sales: productsTopThreeList[i].sales_count,
        share: parseFloat(
          productsTopThreeList[i].sales_percentage ?? 0
        ).toFixed(2),
      };
      topThreeProducts.productItem.push(item);
    }
    console.log(topThreeProducts);

    const topThreeCategories = { categoryItem: [] };
    for (let i = 0; i < categoriesTopThreeList.length; i++) {
      const item = {
        name: categoriesTopThreeList[i].category_name,
        mentions: categoriesTopThreeList[i].mention_count,
        sales: categoriesTopThreeList[i].sales_count,
        share: parseFloat(
          categoriesTopThreeList[i].sales_percentage ?? 0
        ).toFixed(2),
      };
      topThreeCategories.categoryItem.push(item);
    }

    const analyticsResult = {
      quotationsCount: quotationsCount[0].quotations_count,
      totalSpent: totalSpent[0].total_spent,
      expectedProfit: {
        allTime: expectedProfitAllTime[0].total_expected_profit,
        threeMonths: expectedProfitThreeMnths[0].total_expected_profit,
        sixMonths: expectedProfitSixMnths[0].total_expected_profit,
        nineMonths: expectedProfitNineMnths[0].total_expected_profit,
      },
      issuesReportedObj: {
        total: issuesReportedObj[0].total_complaints,
        resolved: parseFloat(
          issuesReportedObj[0].percentage_resolved ?? 0
        ).toFixed(2),
        penaltyResulted: parseFloat(
          issuesReportedObj[0].percentage_penalty ?? 0
        ).toFixed(2),

        resolvedWithNoPenalty: parseFloat(
          issuesReportedObj[0].percentage_resolved_no_penalty ?? 0
        ).toFixed(2),
      },
      complianceIndicator: complianceIndicator[0].est_compliance_indicator,
      quotations: {
        oneYear: {
          requested: quotationsParticipatedOneYr[0].requested_quotations,
          confirmed: quotationsParticipatedOneYr[0].confirmed_quotations,
          completed: quotationsParticipatedOneYr[0].completed_quotations,
        },
        nineMonths: {
          requested: quotationsParticipatedNineMnths[0].requested_quotations,
          confirmed: quotationsParticipatedNineMnths[0].confirmed_quotations,
          completed: quotationsParticipatedNineMnths[0].completed_quotations,
        },
        sixMonths: {
          requested: quotationsParticipatedSixMnths[0].requested_quotations,
          confirmed: quotationsParticipatedSixMnths[0].confirmed_quotations,
          completed: quotationsParticipatedSixMnths[0].completed_quotations,
        },
        threeMonths: {
          requested: quotationsParticipatedThreeMnths[0].requested_quotations,
          confirmed: quotationsParticipatedThreeMnths[0].confirmed_quotations,
          completed: quotationsParticipatedThreeMnths[0].completed_quotations,
        },
      },
      purchaseList: purchaseList,
      topThreeProducts: topThreeProducts,
      topThreeCategories: topThreeCategories,
    };
    return {
      success: true,
      analyticsResult,
    };
  },
};

module.exports = analyticsService;
// Supplier Part
// Queries to Process Analytics ...
// Row1:Entry1: Total Views
/*

SELECT profile_view 
FROM supplier 
WHERE supplier_id = $1;

*/
// Row1:Entry2: Total Revenue
/*

SELECT SUM(total) AS total_revenue 
FROM quotation 
WHERE supplier_id = $1;

*/
// Row1:Entry3: Total CustomerS
/*

SELECT COUNT(DISTINCT requester_id) AS total_customers
FROM quotation
WHERE supplier_id = $1;

*/
// Row1:Entry4:   Supplier Overall Rating
/*

SELECT supplier_overall_rating 
FROM supplier 
WHERE supplier_id = $1;

*/
// Row1:Entry5: Establishment Compliance Indicator
/*

SELECT est_compliance_indicator
FROM establishment
WHERE establishment_id = (SELECT factory_est_id FROM factory WHERE owner_id = $1);

*/
// Row1:Entry6: Total Quotations
/*

SELECT COUNT(quotation_id) AS total_quotations
FROM quotation
WHERE supplier_id = $1;

*/
// Row1:Entry7: Issues Reported
/*

SELECT COUNT(complaint_id) AS issues_reported
FROM complaint
WHERE supplier_id = $1;

*/
// Row2:Compartment1: List of Purchases
/*
 
SELECT 
    quotation_id,
    from_establishment_name,
    total,
    (total * 100.0 / SUM(total) OVER ()) AS percentage_of_total 
FROM 
    quotation
WHERE 
    supplier_id = $1 
    AND quotation_status_id IN (3, 4) AND total IS NOT NULL
ORDER BY 
    percentage_of_total DESC
LIMIT 10;

*/
// Row2:Compartment2: List of Customers
/*
 
WITH customer_quotations AS (
    SELECT 
        requester_id,
        COUNT(*) AS quotation_count
    FROM 
        quotation
    WHERE 
        supplier_id = $1
    GROUP BY 
        requester_id
),
total_quotations AS (
    SELECT 
        SUM(quotation_count) AS total_quotations
    FROM 
        customer_quotations
)
SELECT 
    cq.requester_id AS retailer,
    cq.quotation_count AS number_of_requested_quotations,
    (cq.quotation_count * 100.0 / tq.total_quotations) AS percentage_of_total
FROM 
    customer_quotations cq
CROSS JOIN 
    total_quotations tq
ORDER BY 
    percentage_of_total DESC;

*/
// Row2:Compartment3: Pie chart Reviews
/*
 
SELECT 
COUNT(*) FILTER (WHERE rating_type = FALSE) AS negative_ratings,
COUNT(*) FILTER (WHERE rating_type = TRUE) AS positive_ratings
FROM review 
WHERE supplier_id = $1;

*/
// Row2:Compartment4: Pie chart Complaints
/*
WITH complaints_data AS (
    SELECT
		COUNT(*) AS total_complaints,
        COUNT(*) FILTER (WHERE complaint_status_id = 'RESOLVED') AS resolved_complaints,
        COUNT(*) FILTER (WHERE complaint_status_id = 'RESOLVED' AND is_penalty_resulted = true) AS penalty_complaints,
        COUNT(*) FILTER (WHERE complaint_status_id = 'RESOLVED' AND is_penalty_resulted = false) AS resolved_no_penalty_complaints
    FROM
        complaint
    WHERE
        submitter_type = true
        AND supplier_id = $1
)
SELECT
    (resolved_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1  END) AS percentage_resolved,
    (penalty_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1 END) AS percentage_penalty,
    (resolved_no_penalty_complaints * 100.0 / CASE WHEN resolved_complaints <> 0 THEN resolved_complaints ELSE 1 END) AS percentage_resolved_no_penalty
FROM
    complaints_data;
*/
// Row3:Compartment1: Top 3 Products
/*
WITH product_mentions AS (
    SELECT 
        details->>'productId' AS product_id,
        COUNT(*) AS mention_count
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    WHERE 
        q.supplier_id = $1
    GROUP BY 
        details->>'productId'
),
product_sales AS (
    SELECT 
        details->>'productId' AS product_id,
        COUNT(*) AS sales_count
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    WHERE 
        q.supplier_id = $1
        AND q.quotation_status_id IN (3, 4) -- Status: Confirmed or Completed
    GROUP BY 
        details->>'productId'
),
top_products AS (
    SELECT 
        pm.product_id,
        pm.mention_count,
        ps.sales_count,
        (ps.sales_count * 100.0 / NULLIF(pm.mention_count, 0)) AS sales_percentage
    FROM 
        product_mentions pm
    LEFT JOIN 
        product_sales ps ON pm.product_id = ps.product_id
    ORDER BY 
        pm.mention_count DESC
    LIMIT 3
)
SELECT 
    tp.product_id::INT,
    p.product_name,
    tp.mention_count,
    tp.sales_count,
    COALESCE(tp.sales_percentage, 0) AS sales_percentage
FROM 
    top_products tp
LEFT JOIN 
    product p ON tp.product_id::INT = p.product_id;
*/
// Row3:Compartment1: Top 3 Categories
/*
WITH category_mentions AS (
    SELECT 
        (details->>'productCategory')::VARCHAR AS category_name,
        COUNT(*) AS mention_count
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    WHERE 
        q.supplier_id = $1
    GROUP BY 
        (details->>'productCategory')::VARCHAR
),
category_sales AS (
    SELECT 
        (details->>'productCategory')::VARCHAR AS category_name,
        COUNT(*) AS sales_count
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    WHERE 
        q.supplier_id = $1 
        AND q.quotation_status_id IN (3, 4)
    GROUP BY 
        (details->>'productCategory')::VARCHAR
),
top_categories AS (
    SELECT 
        cm.category_name,
        cm.mention_count,
        cs.sales_count,
        (cs.sales_count * 100.0 / NULLIF(cm.mention_count, 0)) AS sales_percentage
    FROM 
        category_mentions cm
    LEFT JOIN 
        category_sales cs ON cm.category_name = cs.category_name
    ORDER BY 
        cm.mention_count DESC
    LIMIT 3
)
SELECT 
    tc.category_name,
    tc.mention_count,
    tc.sales_count,
    COALESCE(tc.sales_percentage, 0) AS sales_percentage
FROM 
    top_categories tc;
*/
// Admin Part
// Queries to Process Analytics ...
// Row1:Entry1: Total Users
/*
SELECT COUNT(user_id) AS total_users FROM user_localized;
*/
// Row1:Entry2: Total Amount Spent
/*
SELECT SUM(total) AS total_spent FROM quotation;
*/
// Row1:Entry3: Total RetailStores
/*
SELECT COUNT(retailstore_est_id) AS total_retailstores FROM retailstore;
*/
// Row1:Entry4: Total Factories
/*
SELECT COUNT(factory_est_id) AS total_factories FROM factory;
*/
// Row1:Entry5: Total Quotations
/*
SELECT COUNT(quotation_id)  AS total_quotations FROM quotation;
*/
// Row1:Entry6: Total Complaints
/*
SELECT COUNT(complaint_id) AS total_complaints FROM complaint;
*/
// Row1:Entry7: Total Penalties
/*
SELECT COUNT(penalty_id) AS total_penalties FROM penalty;
*/
// Row1:Entry8: Total Products
/*
SELECT COUNT(product_id) AS total_products FROM product;
*/
// Row2:Compartment1: Top 3 Products
/*
WITH product_mentions AS (
    SELECT 
        details->>'productId' AS product_id,
        COUNT(*) AS mention_count
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    GROUP BY 
        details->>'productId'
),
product_sales AS (
    SELECT 
        details->>'productId' AS product_id,
        COUNT(*) AS sales_count
    FROM 
        quotation q
    CROSS JOIN LATERAL 
        jsonb_array_elements(q.quotation_details->'detailsItem') details
    WHERE 
        q.quotation_status_id IN (3, 4) -- Status: Confirmed or Completed
    GROUP BY 
        details->>'productId'
),
top_products AS (
    SELECT 
        pm.product_id,
        pm.mention_count,
        ps.sales_count,
        (ps.sales_count * 100.0 / NULLIF(pm.mention_count, 0)) AS sales_percentage
    FROM 
        product_mentions pm
    LEFT JOIN 
        product_sales ps ON pm.product_id = ps.product_id
    ORDER BY 
        pm.mention_count DESC
    LIMIT 3
)
SELECT 
    tp.product_id::INT,
    p.product_name,
    tp.mention_count,
    tp.sales_count,
    COALESCE(tp.sales_percentage, 0) AS sales_percentage
FROM 
    top_products tp
LEFT JOIN 
    product p ON tp.product_id::INT = p.product_id;
*/
// Row2:Compartment2: Confirmed Quotations
/*
SELECT COUNT(quotation_id) AS confirmed_quotations
FROM  quotation 
WHERE  quotation_status_id = 4;
*/
// Row2:Compartment3: Weekly Sales
/*
SELECT SUM(total) AS weekly_sales
FROM  quotation 
WHERE  quotation_request_date >= CURRENT_DATE - INTERVAL '1 week';
*/
// Row2:Compartment4: Weekly Quotations
/*
SELECT COUNT(quotation_id) AS weekly_quotations
FROM  quotation 
WHERE  quotation_request_date >= CURRENT_DATE - INTERVAL '1 week';
*/
