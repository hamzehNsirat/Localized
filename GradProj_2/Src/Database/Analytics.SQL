-- TABLE: Analytics
-- TYPE: Main

CREATE TABLE analytics ( 
	analytics_id 		 SERIAL PRIMARY KEY,
	product_id 		 	 BIGINT NOT NULL,
	trends    		 	 JSONB NOT NULL,
	sales_count   		 INTEGER  DEFAULT 0,
	views_count   		 INTEGER  DEFAULT 0,
	capture_date  		 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_anltc_product_id FOREIGN KEY (product_id)
    REFERENCES product(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT chk_anltc_sales CHECK(sales_count >= 0),
	CONSTRAINT chk_anltc_views CHECK(views_count >= 0)
);
/*
Analytics Indexes  / Triggers
*/

-- Analytics Product ID Index
-- to optimize the Retrieval Based on a given Analytics's ProductID
CREATE INDEX  idx_fk_product_id ON analytics(product_id);

-- Analytics Capture Date Index
-- to optimize the Retrieval Based on a given Analytics's Capture Date
CREATE INDEX  idx_capture_date ON analytics(capture_date);

-- GET Analytics by ID
CREATE OR REPLACE FUNCTION analytics_get_by_id(IN in_analytics_id BIGINT) 
RETURNS TABLE(
    out_analytics_id 		  BIGINT,
    out_product_id 		 	  BIGINT,
    out_trends 			  JSONB,
    out_sales_count 		  INTEGER,
    out_views_count 		  INTEGER,
    out_capture_date		  TIMESTAMP
) 
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CAST(analytics_id AS BIGINT),
        product_id,
        trends,
        sales_count,
        views_count,
        capture_date
    FROM analytics
    WHERE CAST(analytics_id AS BIGINT) = in_analytics_id;
END;
$$ LANGUAGE plpgsql;

-- GET Analytics by Product ID
CREATE OR REPLACE FUNCTION analytics_get_by_product(IN in_product_id BIGINT) 
RETURNS TABLE(
    out_analytics_id 		  BIGINT,
    out_trends 			  JSONB,
    out_sales_count 		  INTEGER,
    out_views_count 		  INTEGER,
    out_capture_date		  TIMESTAMP
) 
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CAST(analytics_id AS BIGINT),
        trends,
        sales_count,
        views_count,
        capture_date
    FROM analytics
    WHERE CAST(product_id AS BIGINT) = in_product_id;
END;
$$ LANGUAGE plpgsql;

-- INSERT Analytics
CREATE OR REPLACE FUNCTION analytics_insert(
    IN in_product_id BIGINT,
    IN in_trends JSONB,
    IN in_sales_count INTEGER,
    IN in_views_count INTEGER,
    OUT out_analytics_id BIGINT
) 
RETURNS BIGINT 
AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
    INSERT INTO analytics (
        product_id,
        trends,
        sales_count,
        views_count,
        capture_date
    ) VALUES (
        in_product_id,
        in_trends,
        COALESCE(in_sales_count, 0),
        COALESCE(in_views_count, 0),
        CURRENT_TIMESTAMP
    ) RETURNING CAST(analytics_id AS BIGINT) INTO out_analytics_id;
EXCEPTION WHEN OTHERS THEN
    out_analytics_id := -1;
    GET STACKED DIAGNOSTICS
        v_state = RETURNED_SQLSTATE,
        v_msg = MESSAGE_TEXT,
        v_detail = PG_EXCEPTION_DETAIL,
        v_context = PG_EXCEPTION_CONTEXT;
    RAISE NOTICE E'Got exception:
    state: % 
    message: % 
    detail: %
    context: %', v_state, v_msg, v_detail, v_context;
END;
$$ LANGUAGE plpgsql;

-- UPDATE Analytics
CREATE OR REPLACE FUNCTION analytics_update(
    IN in_analytics_id BIGINT,
    IN in_trends JSONB,
    IN in_sales_count INTEGER,
    IN in_views_count INTEGER
) 
RETURNS INTEGER 
AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
    UPDATE analytics
    SET 
        trends = COALESCE(in_trends, trends),
        sales_count = COALESCE(in_sales_count, sales_count),
        views_count = COALESCE(in_views_count, views_count),
        capture_date = CURRENT_TIMESTAMP
    WHERE CAST(analytics_id AS BIGINT) = in_analytics_id;
    RETURN 0;
EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS
        v_state = RETURNED_SQLSTATE,
        v_msg = MESSAGE_TEXT,
        v_detail = PG_EXCEPTION_DETAIL,
        v_context = PG_EXCEPTION_CONTEXT;
    RAISE NOTICE E'Got exception:
    state: % 
    message: % 
    detail: %
    context: %', v_state, v_msg, v_detail, v_context;
    RETURN -1;
END;
$$ LANGUAGE plpgsql;

-- DELETE Analytics
CREATE OR REPLACE FUNCTION analytics_delete(IN in_analytics_id BIGINT) 
RETURNS INTEGER 
AS $$
BEGIN
    DELETE FROM analytics
    WHERE CAST(analytics_id AS BIGINT) = in_analytics_id;
    RETURN 0;
EXCEPTION WHEN OTHERS THEN
    RETURN -1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION analytics_get_by_date(
    in_from_date TIMESTAMP,
    in_to_date TIMESTAMP
)
RETURNS TABLE(
    out_analytics_id BIGINT,
    out_product_id BIGINT,
    out_trends JSONB,
    out_sales_count INTEGER,
    out_views_count INTEGER,
    out_capture_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CAST(analytics_id AS BIGINT),
        product_id,
        trends,
        sales_count,
        views_count,
        capture_date
    FROM
        analytics
    WHERE
        capture_date BETWEEN in_from_date AND in_to_date;
END;
$$ LANGUAGE plpgsql;
