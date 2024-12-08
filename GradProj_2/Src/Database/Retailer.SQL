-- TABLE: Retailer
-- TYPE: Main

CREATE TABLE retailer ( 
	retailer_id SERIAL PRIMARY KEY,
	retailer_user_id    BIGINT NOT NULL,
	retailer_tax_identification_num    VARCHAR(8) NOT NULL UNIQUE,
	retailer_bank_account_num    VARCHAR(18) UNIQUE,
	retailer_iban    VARCHAR(34)  NOT NULL UNIQUE,
	retailer_compliance_indicator FLOAT NOT NULL DEFAULT 0,
	retailer_compliance_count 	    INTEGER NOT NULL DEFAULT 0,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_retailer_user_id FOREIGN KEY (retailer_user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT chk_retlr_compliance_ind CHECK(retailer_compliance_indicator BETWEEN 0 AND 1),
	CONSTRAINT chk_retlr_compliance_cnt CHECK(retailer_compliance_count >= 0)
);
/*
Retailer Indexes  / Triggers
*/

-- Retailer User ID Index
-- to optimize the Retrieval Based on a given Retailer's UserID
CREATE INDEX  idx_fk_retlruser_id ON retailer(retailer_user_id);

-- Retailer TIN Index
-- to optimize the Retrieval Based on a given Retailer's TIN
CREATE INDEX  idx_fk_retlr_tin ON retailer(retailer_tax_identification_num);

-- Retailer CINDIC Index
-- to optimize the Retrieval Based on a given Retailer's CIND
CREATE INDEX  idx_retlr_cmplnce ON retailer(retailer_compliance_indicator);

/*
Retailer CRUD Functions
*/
-- GET A Retailer BY ID
CREATE OR REPLACE FUNCTION retailer_get_by_id(IN in_retailer_id BIGINT)
RETURNS TABLE(		
	out_retailer_user_id    BIGINT,
	out_retailer_tax_identification_num    VARCHAR,
	out_retailer_bank_account_num    VARCHAR,
	out_retailer_iban    VARCHAR,
	out_retailer_compliance_indicator FLOAT,
	out_retailer_complaint_count 	    INTEGER
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	retailer_user_id,
	retailer_tax_identification_num,
	retailer_bank_account_num,
	retailer_iban,
	retailer_compliance_indicator,
	retailer_compliance_count 
	FROM retailer
	WHERE CAST(retailer_id AS BIGINT) = in_retailer_id;
END;
$$ LANGUAGE plpgsql;
-- GET A Retailer Statistics 
CREATE OR REPLACE FUNCTION get_retailer_compliance_statistics (
IN in_retailer_id BIGINT
)
RETURNS TABLE(		
	out_retailer_compliance_indicator FLOAT,
	out_retailer_complaint_count 	    INTEGER
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	retailer_compliance_indicator,
	retailer_compliance_count 	
	FROM retailer
	WHERE CAST(retailer_id AS BIGINT) = in_retailer_id;
END;
$$ LANGUAGE plpgsql;

-- INSERT A Retailer
CREATE OR REPLACE FUNCTION retailer_insert (
	IN in_retailer_user_id    BIGINT,
	IN in_retailer_tax_identification_num    VARCHAR,
	IN in_retailer_bank_account_num    VARCHAR,
	IN in_retailer_iban    VARCHAR,
	IN in_retailer_compliance_indicator FLOAT,
	IN in_retailer_complaint_count 	    INTEGER,
	IN in_last_modified_by	 BIGINT,
	OUT out_retailer_id BIGINT
)
RETURNS BIGINT AS $$
BEGIN
    INSERT INTO retailer 
	(	
	retailer_user_id,
	retailer_tax_identification_num,
	retailer_bank_account_num,
	retailer_iban,
	retailer_compliance_indicator,
	retailer_compliance_count,
	last_modification_date,
	last_modified_by
	)
	VALUES 
	(
	in_retailer_user_id,
	in_retailer_tax_identification_num ,
	in_retailer_bank_account_num,
	in_retailer_iban,
	in_retailer_compliance_indicator ,
	in_retailer_complaint_count 	 ,
	CURRENT_TIMESTAMP,
	in_last_modified_by
	) RETURNING CAST(retailer_id AS BIGINT) INTO out_retailer_id;

EXCEPTION WHEN OTHERS THEN 
	out_retailer_id := -1;	
END;
$$ LANGUAGE plpgsql;

-- UPDATE A Retailer
CREATE OR REPLACE FUNCTION retailer_update (
	IN in_retailer_id    BIGINT,
	IN in_retailer_user_id    BIGINT,
	IN in_retailer_tax_identification_num    VARCHAR,
	IN in_retailer_bank_account_num    VARCHAR,
	IN in_retailer_iban    VARCHAR,
	IN in_retailer_compliance_indicator FLOAT,
	IN in_retailer_complaint_count 	    INTEGER,
	IN in_last_modified_by	 BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
    UPDATE retailer 
	SET	
	retailer_tax_identification_num = COALESCE(in_retailer_tax_identification_num, retailer_tax_identification_num),
	retailer_bank_account_num= COALESCE(in_retailer_bank_account_num, retailer_bank_account_num),
	retailer_iban= COALESCE(in_retailer_iban, retailer_iban),
	retailer_compliance_indicator= COALESCE(in_retailer_compliance_indicator, retailer_compliance_indicator),
	retailer_compliance_count= COALESCE(in_retailer_complaint_count, retailer_compliance_count),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by)

	WHERE CAST(retailer_id AS BIGINT) = in_retailer_id;
	SET update_res = 0;	

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
	out_establishment_id:= -1;

END;
$$ LANGUAGE plpgsql;


-- DELETE A Retailer
CREATE OR REPLACE FUNCTION retailer_delete (
	IN in_retailer_user_id BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
	SELECT user_delete(in_retailer_user_id);
	SET update_res = 0;	
EXCEPTION WHEN OTHERS THEN 
	update_res := -1;	
END;
$$ LANGUAGE plpgsql;
