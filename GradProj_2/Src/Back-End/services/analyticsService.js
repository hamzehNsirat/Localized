/*
LAST MODIFIED: 16-12-2024
*/
const { executeQuery } = require("../config/database");
const AnalyticsModel = require("../models/Analytics");
const analyticsModel = require("../models/Analytics");
const moment = require("moment");

const analyticsService = {
  // Processes data analytics for dashboards Display
  // Retailer Part
  async getRetailerAnalytics(userId) {
    let isInsertedFlag = false;
    const fetchAnalyticsDb = await analyticsModel.getAnalyticsByUserId(userId);
    if (Object.entries(fetchAnalyticsDb).length != 0) {
      if (
        fetchAnalyticsDb[0].out_capture != null &&
        moment(fetchAnalyticsDb[0].out_capture_date).isSame(moment(), "day")
      ) {
        // take from db
        const res = fetchAnalyticsDb[0].out_capture;
        return {
          analyticsResult: res,
        };
      } else {
        isInsertedFlag = true;
      }
    }
    // process and insert in db
    const retailerId = await executeQuery(
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

    const expectedProfitOneYr = await executeQuery(
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
    AND q.requester_id = $1   AND q.quotation_request_date >= CURRENT_DATE - INTERVAL '1 year';`,
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
        COUNT(*) FILTER (WHERE complaint_status_id <> 'RESOLVED') AS un_resolved_complaints,
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
        (un_resolved_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1  END) AS percentage_unresolved,
        (penalty_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1 END) AS percentage_penalty,
        (resolved_no_penalty_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1 END) AS percentage_resolved_no_penalty
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


    const quotationsParticipatedAllTime = await executeQuery(
      `SELECT
        COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
    FROM
        quotation
    WHERE
        requester_id = $1;
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
      quotationsCount: quotationsCount[0]?.quotations_count || 0,
      totalSpent: totalSpent[0]?.total_spent || 0,
      expectedProfit: {
        allTime: expectedProfitAllTime[0]?.total_expected_profit || 0,
        oneYear: expectedProfitOneYr[0]?.total_expected_profit || 0,
        threeMonths: expectedProfitThreeMnths[0]?.total_expected_profit || 0,
        sixMonths: expectedProfitSixMnths[0]?.total_expected_profit || 0,
        nineMonths: expectedProfitNineMnths[0]?.total_expected_profit || 0,
      },
      issuesReportedObj: {
        total: issuesReportedObj[0]?.total_complaints || 0,
        unresolved:
          parseFloat(issuesReportedObj[0]?.percentage_unresolved ?? 0).toFixed(
            2
          ) || 0,
        penaltyResulted:
          parseFloat(issuesReportedObj[0]?.percentage_penalty ?? 0).toFixed(
            2
          ) || 0,
        resolvedWithNoPenalty:
          parseFloat(
            issuesReportedObj[0]?.percentage_resolved_no_penalty || 0
          ).toFixed(2) || 0,
      },
      complianceIndicator:
        complianceIndicator[0]?.est_compliance_indicator || 0,
      quotations: {
        allTime: {
          requested:
            quotationsParticipatedAllTime[0]?.requested_quotations || 0,
          confirmed:
            quotationsParticipatedAllTime[0]?.confirmed_quotations || 0,
          completed:
            quotationsParticipatedAllTime[0]?.completed_quotations || 0,
        },
        oneYear: {
          requested: quotationsParticipatedOneYr[0]?.requested_quotations || 0,
          confirmed: quotationsParticipatedOneYr[0]?.confirmed_quotations || 0,
          completed: quotationsParticipatedOneYr[0]?.completed_quotations || 0,
        },
        nineMonths: {
          requested:
            quotationsParticipatedNineMnths[0]?.requested_quotations || 0,
          confirmed:
            quotationsParticipatedNineMnths[0]?.confirmed_quotations || 0,
          completed:
            quotationsParticipatedNineMnths[0]?.completed_quotations || 0,
        },
        sixMonths: {
          requested:
            quotationsParticipatedSixMnths[0]?.requested_quotations || 0,
          confirmed:
            quotationsParticipatedSixMnths[0]?.confirmed_quotations || 0,
          completed:
            quotationsParticipatedSixMnths[0]?.completed_quotations || 0,
        },
        threeMonths: {
          requested:
            quotationsParticipatedThreeMnths[0]?.requested_quotations || 0,
          confirmed:
            quotationsParticipatedThreeMnths[0]?.confirmed_quotations || 0,
          completed:
            quotationsParticipatedThreeMnths[0]?.completed_quotations || 0,
        },
      },
      purchaseList: purchaseList || null,
      topThreeProducts: topThreeProducts || null,
      topThreeCategories: topThreeCategories || null,
    };

    if (!isInsertedFlag) {
      const insertDb = await AnalyticsModel.insertAnalytics(
        userId,
        analyticsResult
      );
    } else {
      const updateDb = await AnalyticsModel.updateAnalytics(
        analyticsResult,
        userId
      );
    }
    return {
      analyticsResult: analyticsResult,
    };
  },

  // Supplier Part
  async getSupplierAnalytics(userId) {
    const supplierId = await await executeQuery(
      `SELECT 
    supplier_id
    FROM 
    supplier    
    WHERE 
    supplier_user_id = $1;`,
      [userId]
    );
    if (!supplierId) {
      return { success: false };
    }
    let isInsertedFlag = false;
    const fetchAnalyticsDb = await analyticsModel.getAnalyticsByUserId(userId);
    if (Object.entries(fetchAnalyticsDb).length != 0) {
      if (
        fetchAnalyticsDb[0].out_capture != null &&
        moment(fetchAnalyticsDb[0].out_capture_date).isSame(moment(), "day")
      ) {
        // take from db
        const res = fetchAnalyticsDb[0].out_capture;
        return {
          analyticsResult: res,
        };
      } else {
        isInsertedFlag = true;
      }
    }

    const profileViews = await executeQuery(
      `SELECT profile_view 
    FROM supplier 
    WHERE supplier_id = $1;
    `,
      [supplierId[0].supplier_id]
    );

    const totalRevenue = await executeQuery(
      `SELECT SUM(total) AS total_revenue 
    FROM quotation 
    WHERE supplier_id = $1 AND quotation_status_id IN(3,4);
    `,
      [supplierId[0].supplier_id]
    );

    const totalCustomers = await executeQuery(
      `SELECT COUNT(DISTINCT requester_id) AS total_customers
    FROM quotation
    WHERE supplier_id = $1;`,
      [supplierId[0].supplier_id]
    );

    const overallRating = await executeQuery(
      `SELECT supplier_overall_rating 
    FROM supplier 
    WHERE supplier_id = $1;`,
      [supplierId[0].supplier_id]
    );

    const complianceIndicator = await executeQuery(
      `SELECT est_compliance_indicator
    FROM establishment
    WHERE establishment_id = (SELECT factory_est_id FROM factory WHERE owner_id = $1);
    `,
      [supplierId[0].supplier_id]
    );

    const totalQuotations = await executeQuery(
      `SELECT COUNT(quotation_id) AS total_quotations
    FROM quotation
    WHERE supplier_id = $1;
    `,
      [supplierId[0].supplier_id]
    );

    const issuesReportedCount = await executeQuery(
      `SELECT COUNT(complaint_id) AS issues_reported
    FROM complaint
    WHERE supplier_id = $1;
    `,
      [supplierId[0].supplier_id]
    );

    const purchasesList = await executeQuery(
      `SELECT 
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
    `,
      [supplierId[0].supplier_id]
    );

    const customersList = await executeQuery(
      `WITH customer_quotations AS (
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
    `,
      [supplierId[0].supplier_id]
    );

    const reviewObj = await executeQuery(
      `SELECT 
    COUNT(*) AS count,
    COUNT(*) FILTER (WHERE rating_type = FALSE) AS negative_ratings,
    COUNT(*) FILTER (WHERE rating_type = TRUE) AS positive_ratings
    FROM review 
    WHERE supplier_id = $1;
    `,
      [supplierId[0].supplier_id]
    );

    const complaintsObj = await executeQuery(
    `WITH complaints_data AS (
    SELECT
        COUNT(*) AS total_complaints,
        COUNT(*) FILTER (WHERE complaint_status_id <> 'RESOLVED') AS un_resolved_complaints,
        COUNT(*) FILTER (WHERE complaint_status_id = 'RESOLVED' AND is_penalty_resulted = true) AS penalty_complaints,
        COUNT(*) FILTER (WHERE complaint_status_id = 'RESOLVED' AND is_penalty_resulted = false) AS resolved_no_penalty_complaints
    FROM
        complaint
    WHERE
        submitter_type = true
        AND retailer_id = $1
    )
    SELECT
        total_complaints,
        (un_resolved_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1  END) AS percentage_unresolved,
        (penalty_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1 END) AS percentage_penalty,
        (resolved_no_penalty_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1 END) AS percentage_resolved_no_penalty
    FROM
    complaints_data;    `,
      [supplierId[0].supplier_id]
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
    `,
      [supplierId[0].supplier_id]
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
    `,
      [supplierId[0].supplier_id]
    );

    const customerList = { customerItem: [] };
    for (let i = 0; i < customersList.length; i++) {
      const item = {
        retailer: customersList[i].retailer,
        numberOfQuotations: customersList[i].number_of_requested_quotations,
        share: parseFloat(purchasesList[i].percentage_of_total ?? 0).toFixed(2),
      };
      customerList.customerItem.push(item);
    }
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
      profileViews: profileViews[0].profile_view || 0,
      totalRevenue: totalRevenue[0].total_revenue || 0,
      totalCustomers: totalCustomers[0].total_customers || 0,
      overallRating: overallRating[0].supplier_overall_rating,
      complianceIndicator: complianceIndicator[0].est_compliance_indicator || 0,
      totalQuotations: totalQuotations[0].total_quotations || 0,
      purchaseList: purchaseList || null,
      customerList: customerList,
      review: {
        positivePercentage:
          (reviewObj[0].positive_ratings / (reviewObj[0].count ?? 1)) * 100 ||
          0,
        negativePercentage:
          (reviewObj[0].negative_ratings / (reviewObj[0].count ?? 1)) * 100 ||
          0,
      },
      issuesReportedObj: {
        total: issuesReportedCount[0].issues_reported || 0,
        unresolved:
          parseFloat(complaintsObj[0].percentage_unresolved ?? 0).toFixed(2) ||
          0,
        penaltyResulted:
          parseFloat(complaintsObj[0].percentage_penalty ?? 0).toFixed(2) || 0,
        resolvedWithNoPenalty:
          parseFloat(
            complaintsObj[0].percentage_resolved_no_penalty ?? 0
          ).toFixed(2) || 0,
      },
      topThreeProducts: topThreeProducts || null,
      topThreeCategories: topThreeCategories || null,
    };

    if (!isInsertedFlag) {
      const insertDb = await AnalyticsModel.insertAnalytics(
        userId,
        analyticsResult
      );
    } else {
      const updateDb = await AnalyticsModel.updateAnalytics(
        analyticsResult,
        userId
      );
    }
    return {
      analyticsResult: analyticsResult,
    };
  },

  // Adminstrator Part
  async getAdminstratorAnalytics(userId) {
    let isInsertedFlag = false;
    const fetchAnalyticsDb = await analyticsModel.getAnalyticsByUserId(userId);
    if (Object.entries(fetchAnalyticsDb).length != 0) {
      if (
        fetchAnalyticsDb[0].out_capture != null &&
        moment(fetchAnalyticsDb[0].out_capture_date).isSame(moment(), "day")
      ) {
        // take from db
        const res = fetchAnalyticsDb[0].out_capture;
        return {
          analyticsResult: res,
        };
      } else {
        isInsertedFlag = true;
      }
    }

    const totalUsers = await executeQuery(
      `SELECT COUNT(user_id) AS total_users FROM user_localized;`
    );

    const totalSpent = await executeQuery(
      `SELECT SUM(total) AS total_spent FROM quotation;`
    );

    const totalRetailStores = await executeQuery(
      `SELECT COUNT(retailstore_est_id) AS total_retailstores FROM retailstore;`
    );

    const totalFactories = await executeQuery(
      `SELECT COUNT(factory_est_id) AS total_factories FROM factory;`
    );

    const totalQuotations = await executeQuery(
      `SELECT COUNT(quotation_id)  AS total_quotations FROM quotation;`
    );

    const totalComplaints = await executeQuery(
      `SELECT COUNT(complaint_id) AS total_complaints FROM complaint;`
    );

    const totalPenalties = await executeQuery(
      `SELECT COUNT(penalty_id) AS total_penalties FROM penalty;`
    );

    const totalProducts = await executeQuery(
      `SELECT COUNT(product_id) AS total_products FROM product;`
    );

    const totalConfirmedQuotations = await executeQuery(
      `SELECT COUNT(quotation_id) AS confirmed_quotations
    FROM  quotation 
    WHERE  quotation_status_id = 4;`
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
    `
    );

    const weeklySalesDb = await executeQuery(
    `SELECT 
    quotation_id,
    from_establishment_name,
    COALESCE(total, 0) AS total, 
    COALESCE((total * 100.0 / SUM(total) OVER ()),0) AS percentage_of_total 
    FROM 
        quotation
    WHERE 
        quotation_request_date >= CURRENT_DATE - INTERVAL '1 week'
    ORDER BY 
        percentage_of_total DESC
    LIMIT 3;`
    );
    const weeklySales = { SalesItem: [] };
    for (let i = 0; i < weeklySalesDb.length; i++) {
      const item = {
        id: weeklySalesDb[i].quotation_id,
        name: weeklySalesDb[i].to_establishment_name,
        total: weeklySalesDb[i].total || 0,
        share: parseFloat(weeklySalesDb[i]?.percentage_of_total || 0).toFixed(2),
      };
      weeklySales.SalesItem.push(item);
    }

    const weeklyQuotations = await executeQuery(
    `SELECT
        COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
        COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
    FROM
        quotation
    WHERE quotation_request_date >= CURRENT_DATE - INTERVAL '1 week';
    `
    );

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

    const analyticsResult = {
      users: totalUsers[0].total_users || 0,
      spent: totalSpent[0].total_spent || 0,
      RetailStores: totalRetailStores[0].total_retailstores || 0,
      Factories: totalFactories[0].total_factories,
      Quotations: totalQuotations[0].total_quotations || 0,
      Complaints: totalComplaints[0].total_complaints || 0,
      Penalties: totalPenalties[0].total_penalties || 0,
      Products: totalProducts[0].total_products,
      ConfirmedQuotations:
        totalConfirmedQuotations[0].confirmed_quotations || 0,
      topThreeProducts: topThreeProducts || null,
      weeklySales: weeklySales,
      weeklyQuotations: {
        requested: weeklyQuotations[0]?.requested_quotations || 0,
        confirmed: weeklyQuotations[0]?.confirmed_quotations || 0,
        completed: weeklyQuotations[0]?.completed_quotations || 0,
      },
    };

    if (!isInsertedFlag) {
      const insertDb = await AnalyticsModel.insertAnalytics(
        userId,
        analyticsResult
      );
    } else {
      const updateDb = await AnalyticsModel.updateAnalytics(
        analyticsResult,
        userId
      );
    }

    return {
      analyticsResult: analyticsResult,
    };
  },
};

module.exports = analyticsService;
