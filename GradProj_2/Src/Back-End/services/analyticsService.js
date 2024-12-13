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
    total_complaints,
    (resolved_complaints * 100.0 / total_complaints) AS percentage_resolved,
    (penalty_complaints * 100.0 / total_complaints) AS percentage_penalty,
    (resolved_no_penalty_complaints * 100.0 / resolved_complaints) AS percentage_resolved_no_penalty
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