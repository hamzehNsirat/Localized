-- TABLE: Adminstrator
-- TYPE: Main

CREATE TABLE adminstrator ( 
	admin_id SERIAL PRIMARY KEY,
	hire_date    TIMESTAMP NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	fk_userid	BIGINT DEFAULT NULL
);
/*
Adminstrator CRUD Functions
*/
-- GET ALL Adminstrators
CREATE OR REPLACE FUNCTION adminstrators_get()
RETURNS TABLE(adminstrator_id BIGINT,admin_user_id BIGINT, hire_date DATE) AS $$
BEGIN
    RETURN QUERY SELECT CAST(D.admin_id AS BIGINT), fk_userid, CAST(D.hire_date AS DATE) FROM adminstrator AS D;
END;
$$ LANGUAGE plpgsql;
-- INSERT AN Admin
CREATE OR REPLACE FUNCTION adminstrators_insert(IN in_user_id BIGINT, IN last_modifier BIGINT, OUT out_admin_id BIGINT)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
	INSERT INTO adminstrator (hire_date, last_modification_date, last_modified_by,fk_userid) VALUES
	(CURRENT_DATE, CURRENT_TIMESTAMP, last_modifier, in_user_id) RETURNING admin_id INTO out_admin_id;
EXCEPTION WHEN OTHERS THEN 
	get stacked diagnostics
	v_state = returned_sqlstate,
	v_msg = message_text,
	v_detail = pg_exception_detail,
	v_context = pg_exception_context;
        
    raise notice E' Got exception:
    state: % 
    message: % 
    detail: %
    hint: %
    context: %',  v_state, v_msg, v_detail, v_hint, v_context;
	out_admin_id := -1;	
END;
$$ LANGUAGE plpgsql;
-- DELETE AN Adminstrator
CREATE OR REPLACE FUNCTION adminstrators_delete(IN in_admin_id BIGINT, IN last_modifier BIGINT)
RETURNS INTEGER AS $$

BEGIN
	DELETE FROM adminstrator  AS D
	WHERE CAST(D.admin_id AS BIGINT) = in_admin_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 

	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;