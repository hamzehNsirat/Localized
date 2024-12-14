// Processes data analytics for dashboards Display
// Retailer Part
// Queries to Process Analytics ...
// Row1:Entry1: Quotations Count
/*
SELECT 
    COUNT(quotation_id) AS quotations_count
FROM 
    quotation
WHERE 
    requester_id = $1;
*/
// Row1:Entry2: Total Spent
/*
SELECT 
    SUM(total) AS total_spent
FROM 
    quotation
WHERE 
    requester_id = $1 AND quotation_status_id = (SELECT quotation_status_id FROM quotation_status WHERE quotation_status LIKE '%COMPLETED%');
*/
// Row1:Entry3: Expected Profit (all time)
/*
SELECT 
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
    AND q.requester_id = $1;
*/
// Row1:Entry3: Expected Profit (3 months)
/*
SELECT 
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
    AND q.requester_id = 9   AND q.quotation_request_date >= CURRENT_DATE - INTERVAL '3 months';

*/
// Row1:Entry3: Expected Profit (all time)
/*
SELECT 
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
    AND q.requester_id = 9   AND q.quotation_request_date >= CURRENT_DATE - INTERVAL '6 months';

*/
// Row1:Entry3: Expected Profit (all time)
/*
SELECT 
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
    AND q.requester_id = 9   AND q.quotation_request_date >= CURRENT_DATE - INTERVAL '9 months';

*/
// Row1:Entry4: Issues Reported
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
        submitter_type = false
        AND retailer_id = $1
)
SELECT
    (resolved_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1  END) AS percentage_resolved,
    (penalty_complaints * 100.0 /  CASE WHEN total_complaints <> 0 THEN total_complaints ELSE 1 END) AS percentage_penalty,
    (resolved_no_penalty_complaints * 100.0 / CASE WHEN resolved_complaints <> 0 THEN resolved_complaints ELSE 1 END) AS percentage_resolved_no_penalty
FROM
    complaints_data;

*/
// Row1:Entry5: Complaince Indicator
/*

SELECT est_compliance_indicator 
FROM establishment 
WHERE establishment_id = (SELECT retailstore_est_id FROM retailstore WHERE owner_id = $1);

*/
// Row2:Compartment1: Quotations that are Completed, Requested and Confirmed in (1Y,9M,6M,3M)
/*
-- 1 YEAR
SELECT
	COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
	COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
	COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
FROM
	quotation
WHERE
	requester_id = 1
	AND quotation_request_date >= CURRENT_DATE - INTERVAL '1 year';
-- 9 MONTHS
SELECT
	COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
	COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
	COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
FROM
	quotation
WHERE
	requester_id = 1
	AND quotation_request_date >=  CURRENT_DATE - INTERVAL '9 month';
-- 6 MONTHS
SELECT
	COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
	COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
	COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
FROM
	quotation
WHERE
	requester_id = 1
	AND quotation_request_date >=  CURRENT_DATE - INTERVAL '6 month';
-- 3 MONTHS
SELECT
	COUNT(*) FILTER (WHERE quotation_status_id = 1) AS requested_quotations,
	COUNT(*) FILTER (WHERE quotation_status_id = 3) AS confirmed_quotations,
	COUNT(*) FILTER (WHERE quotation_status_id = 4) AS completed_quotations
FROM
	quotation
WHERE
	requester_id = 1
	AND quotation_request_date >=  CURRENT_DATE - INTERVAL '3 month';
*/

// Row2:Compartment2: List of Purchases (Quotation Confirmed+Completed) and Done By Retailer (QuotationID, Factory Name, Amount, Percentage)
/*
 
SELECT 
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

*/
// Row2:Compartment3: Piechart, percantage of resolved / penalties / without a penalty Complaints
/*ALREADY CALCULATED*/
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
*/
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
