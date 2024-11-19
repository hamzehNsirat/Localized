-- TABLE: Purchase Status
-- TYPE: Look up

CREATE TABLE purchase_status (
	purchase_status_id SERIAL PRIMARY KEY,
	purchase_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);


CREATE OR REPLACE FUNCTION purchase_status_get_all()
RETURNS TABLE(
    out_purchase_status_id BIGINT,
    out_purchase_status    VARCHAR,
    out_last_modification_date TIMESTAMP,
    out_last_modified_by   BIGINT
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        CAST(purchase_status_id AS BIGINT),
        purchase_status,
        last_modification_date,
        last_modified_by
    FROM purchase_status;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION purchase_status_get_by_id(
    IN in_purchase_status_id BIGINT
)
RETURNS TABLE(
    out_purchase_status    VARCHAR,
    out_last_modification_date TIMESTAMP,
    out_last_modified_by   BIGINT
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        purchase_status,
        last_modification_date,
        last_modified_by
    FROM purchase_status
    WHERE CAST(purchase_status_id AS BIGINT) = in_purchase_status_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION purchase_status_insert(
    IN in_purchase_status VARCHAR,
    IN in_last_modified_by BIGINT,
    OUT out_purchase_status_id BIGINT
)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_context TEXT;
BEGIN
    INSERT INTO purchase_status (
        purchase_status,
        last_modification_date,
        last_modified_by
    ) VALUES (
        in_purchase_status,
        CURRENT_TIMESTAMP,
        in_last_modified_by
    )
    RETURNING CAST(purchase_status_id AS BIGINT) INTO out_purchase_status_id;

EXCEPTION WHEN OTHERS THEN
    out_purchase_status_id := -1;
    GET STACKED DIAGNOSTICS
        v_state = RETURNED_SQLSTATE,
        v_msg = MESSAGE_TEXT,
        v_detail = PG_EXCEPTION_DETAIL,
        v_context = PG_EXCEPTION_CONTEXT;

    RAISE NOTICE E'Got exception:
        state: % 
        message: % 
        detail: %
        context: %',
        v_state, v_msg, v_detail, v_context;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION purchase_status_update(
    IN in_purchase_status_id BIGINT,
    IN in_purchase_status VARCHAR,
    IN in_last_modified_by BIGINT,
    OUT update_res INT
)
RETURNS INT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_context TEXT;
BEGIN
    UPDATE purchase_status
    SET 
        purchase_status = COALESCE(in_purchase_status, purchase_status),
        last_modification_date = CURRENT_TIMESTAMP,
        last_modified_by = COALESCE(in_last_modified_by, last_modified_by)
    WHERE 
        CAST(purchase_status_id AS BIGINT) = in_purchase_status_id;

    update_res := 0;

EXCEPTION WHEN OTHERS THEN
    update_res := -1;
    GET STACKED DIAGNOSTICS
        v_state = RETURNED_SQLSTATE,
        v_msg = MESSAGE_TEXT,
        v_detail = PG_EXCEPTION_DETAIL,
        v_context = PG_EXCEPTION_CONTEXT;

    RAISE NOTICE E'Got exception:
        state: % 
        message: % 
        detail: %
        context: %',
        v_state, v_msg, v_detail, v_context;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION purchase_status_delete(
    IN in_purchase_status_id BIGINT,
    OUT update_res INT
)
RETURNS INT AS $$
BEGIN
    DELETE FROM purchase_status
    WHERE CAST(purchase_status_id AS BIGINT) = in_purchase_status_id;

    update_res := 0;

EXCEPTION WHEN OTHERS THEN
    update_res := -1;
END;
$$ LANGUAGE plpgsql;
