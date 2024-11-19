-- TABLE: Purchase Transaction
-- TYPE: Main

CREATE TABLE purchase_transaction ( 
	purchase_transaction_id SERIAL PRIMARY KEY,
	purchase_id 			 BIGINT NOT NULL,
	transaction_status_id 	 BIGINT,
	transaction_date	     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	transaction_details     JSONB NOT NULL,
	last_modification_date  TIMESTAMP  NOT NULL,
	last_modified_by		BIGINT     NOT NULL,
	CONSTRAINT fk_prchstrx_purchase_id FOREIGN KEY (purchase_id)
    REFERENCES purchase(purchase_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_prchstrx_status_id FOREIGN KEY (transaction_status_id)
    REFERENCES transaction_status(transaction_status_id) ON DELETE SET NULL ON UPDATE CASCADE
);
/*
Purchase Transaction Indexes  / Triggers
*/

-- Purchase ID Index
-- to optimize the Retrieval Based on a given Purchase Transaction's Purchase ID
CREATE INDEX  idx_purchasetrx_purchase_id ON purchase_transaction(purchase_id);



/*
 Purchase CRUD Functions
*/

-- GET A Purchase TRX BY Purchase ID
CREATE OR REPLACE FUNCTION purchase_transaction_get_by_purchase(IN in_purchase_id BIGINT) 
RETURNS TABLE(
	out_purchase_transaction_id  BIGINT,
	out_purchase_id 			 BIGINT,
	out_transaction_status_id 	 BIGINT,
	out_transaction_date	     TIMESTAMP,
	out_transaction_details     JSONB,
	out_last_modification_date     TIMESTAMP,
	out_last_modified_by		   BIGINT
) 
AS $$ BEGIN
	IF in_purchase_id IS NOT NULL THEN 
		RETURN QUERY
		SELECT
		purchase_transaction_id,
		purchase_id,
		transaction_status_id,
		transaction_date,
		transaction_details,
		last_modification_date,
		last_modified_by
		FROM	purchase_transaction
		WHERE	CAST(purchase_id AS BIGINT) = in_purchase_id;
	END IF;
END;
$$ LANGUAGE plpgsql;

-- INSERT A purchase
CREATE OR REPLACE FUNCTION purchase_transaction_insert (
	IN in_purchase_id 			 BIGINT,
	IN in_transaction_status_id 	 BIGINT,
	IN in_transaction_date	     TIMESTAMP,
	IN in_transaction_details     JSONB,
	IN in_last_modification_date     TIMESTAMP,
	IN in_last_modified_by		   BIGINT,
	OUT out_purchase_transaction_id BIGINT
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
	INSERT INTO
	purchase_transaction (
		purchase_id 			 ,
		transaction_status_id 	 ,
		transaction_date	     ,
		transaction_details     ,
		last_modification_date     ,
		last_modified_by		   
	)
	VALUES
	(
		in_purchase_id,
		in_transaction_status_id,
		in_transaction_date,
		in_transaction_details,
		CURRENT_TIMESTAMP,
		in_last_modified_by	
	) RETURNING CAST(purchase_transaction_id AS BIGINT) INTO out_purchase_transaction_id;
EXCEPTION
WHEN OTHERS THEN 
	out_purchase_transaction_id := -1;
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


-- UPDATE A purchase
CREATE OR REPLACE FUNCTION purchase_transaction_status_update (
	IN in_purchase_transaction_id 			   BIGINT,
	IN in_transaction_status_id 	       BIGINT,
	IN in_last_modification_date     TIMESTAMP,
	IN in_last_modified_by		   BIGINT,
	OUT update_res INT
) 
RETURNS INT 
AS $$ 
DECLARE
v_state TEXT;
v_msg TEXT;
v_detail TEXT;
v_hint TEXT;
v_context TEXT;
BEGIN
	UPDATE	purchase_transaction
	SET
	transaction_status_id = COALESCE(in_transaction_status_id, transaction_status_id) ,
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by = COALESCE(in_last_modified_by, last_modified_by)	   
	WHERE
	CAST(purchase_transaction_id AS BIGINT) = in_purchase_transaction_id;
	update_res := 0;

EXCEPTION WHEN OTHERS THEN 

	update_res := -1;
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

