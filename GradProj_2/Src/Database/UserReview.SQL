-- TABLE: User Review
-- TYPE: Main

CREATE TABLE user_review ( 
	user_review_id SERIAL PRIMARY KEY,
	admin_id        BIGINT, 
	user_id   		BIGINT,
	decision_taken  VARCHAR(35) NOT NULL,
	decision_reason TEXT DEFAULT NULL,
	creation_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_urev_user_id FOREIGN KEY (user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE,
	CONSTRAINT fk_urev_reviewer_id FOREIGN KEY (admin_id)
    REFERENCES adminstrator(admin_id) ON DELETE SET NULL,
	CONSTRAINT chk_urev_decision_taken CHECK(decision_taken IN('ADMITTANCE', 'DEFERRAL', 'FREEZING', 'REJECTION'))
);

/*
 UserReview CRUD Functions
*/
-- GET A UserReview BY ID
CREATE OR REPLACE FUNCTION user_review_get_all() 
RETURNS TABLE (
	out_user_review_id  BIGINT,
	out_admin_id        BIGINT, 
	out_user_id   		BIGINT,
	out_decision_taken  VARCHAR,
	out_decision_reason TEXT,
	out_creation_date   TIMESTAMP,
	out_last_modification_date  TIMESTAMP,
	out_last_modified_by		 BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT 
	CAST(user_review_id AS BIGINT),
	admin_id        , 
	user_id   		,
	decision_taken ,
	decision_reason,
	creation_date,   
	last_modification_date, 
	last_modified_by
	FROM user_review;
END;
$$ LANGUAGE plpgsql;

-- INSERT A UserReview
CREATE OR REPLACE FUNCTION user_review_insert(
	IN in_admin_id BIGINT, 
	IN in_user_id BIGINT,
	IN in_decision_taken VARCHAR,
	IN in_decision_reason TEXT,
	IN in_creation_date TIMESTAMP,   
	IN in_last_modified_by BIGINT,
	OUT out_user_review_id     BIGINT
)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
	INSERT INTO user_review (
	admin_id , 
	user_id ,
	decision_taken ,
	decision_reason,
	creation_date ,   
	last_modification_date , 
	last_modified_by 
	) VALUES
	( 
	in_admin_id ,  
	in_user_id ,
	in_decision_taken ,
	in_decision_reason,
	CURRENT_TIMESTAMP,   
	CURRENT_TIMESTAMP, 
	in_last_modified_by
	) RETURNING CAST(user_review_id AS BIGINT) INTO out_user_review_id;

EXCEPTION WHEN OTHERS THEN 

	out_user_review_id := -1;	
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
END;
$$ LANGUAGE plpgsql;

-- UPDATE A UserReview
CREATE OR REPLACE FUNCTION user_review_update (
	IN in_reviewer_id 		BIGINT,
	IN in_decision_taken 	VARCHAR,
	IN in_decision_reason	TEXT,
	IN in_user_review_id    BIGINT
)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
	UPDATE user_review SET
		admin_id = COALESCE(in_reviewer_id, admin_id) , 
		decision_taken = COALESCE(in_decision_taken, decision_taken) , 
		decision_reason = COALESCE(in_decision_reason, decision_reason),
		last_modification_date = CURRENT_TIMESTAMP,
		last_modified_by= COALESCE(in_last_modified_by, last_modified_by);
	RETURN 0;
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
	RETURN -1;	
END;
$$ LANGUAGE plpgsql;