-- TABLE: Analytics
-- TYPE: Main

CREATE TABLE analytics ( 
	analytics_id 		 SERIAL PRIMARY KEY,
	user_id 		 	 BIGINT NOT NULL,
	capture    		 	 JSONB NOT NULL,
	capture_date  		 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_anltc_product_id FOREIGN KEY (user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
/*
Analytics Indexes  / Triggers
*/

-- Analytics Product ID Index
-- to optimize the Retrieval Based on a given Analytics's ProductID
CREATE INDEX  idx_fk_user_id ON analytics(user_id);

-- Analytics Capture Date Index
-- to optimize the Retrieval Based on a given Analytics's Capture Date
CREATE INDEX  idx_capture_date ON analytics(capture_date);

-- GET Analytics by ID
CREATE OR REPLACE FUNCTION analytics_get_by_user_id(IN in_user_id BIGINT) 
RETURNS TABLE(
    out_analytics_id 		  BIGINT,
    out_capture 			  JSONB,
    out_capture_date		  TIMESTAMP
) 
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CAST(analytics_id AS BIGINT),
        capture ,
        capture_date
    FROM analytics
    WHERE CAST(user_id AS BIGINT) = in_user_id
    ORDER BY capture_date DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- INSERT Analytics
CREATE OR REPLACE FUNCTION analytics_insert(
    IN in_user_id BIGINT,
    IN in_capture JSONB,
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
        user_id,
        capture,
        capture_date
    ) VALUES (
        in_user_id,
        in_capture,
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
    IN in_capture JSONB,
    IN in_analytics_id BIGINT
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
        capture = COALESCE(in_capture, capture),
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
