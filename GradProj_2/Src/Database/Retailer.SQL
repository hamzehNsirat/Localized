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
CREATE OR REPLACE FUNCTION retialer_get_by_id(IN in_retialer_id BIGINT)
RETURNS TABLE(		
	retialer_user_id    BIGINT,
	retialer_tax_identification_num    VARCHAR,
	retialer_bank_account_num    VARCHAR,
	retialer_iban    VARCHAR,
	retialer_compliance_indicator FLOAT,
	retialer_complaint_count 	    INTEGER
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	retialer_user_id,
	retialer_tax_identification_num,
	retialer_bank_account_num,
	retialer_iban,
	retialer_compliance_indicator,
	retialer_complaint_count 
	FROM retailer
	WHERE CAST(retialer_id AS BIGINT) = in_retialer_id;
END;
$$ LANGUAGE plpgsql;
-- GET A Retailer Statistics 
CREATE OR REPLACE FUNCTION get_retialer_compliance_statistics (
IN in_retialer_id BIGINT
)
RETURNS TABLE(		
	retialer_compliance_indicator FLOAT,
	retialer_complaint_count 	    INTEGER,
	retialer_positive_review_count INTEGER
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	retialer_compliance_indicator,
	retialer_complaint_count 	,
	retialer_positive_review_count
	FROM retailer
	WHERE CAST(retialer_id AS BIGINT) = in_retialer_id;
END;
$$ LANGUAGE plpgsql;

-- INSERT A Retailer
CREATE OR REPLACE FUNCTION retialer_insert (
	IN in_retialer_user_id    BIGINT,
	IN in_retialer_tax_identification_num    VARCHAR,
	IN in_retialer_bank_account_num    VARCHAR,
	IN in_retialer_iban    VARCHAR,
	IN in_retialer_compliance_indicator FLOAT,
	IN in_retialer_complaint_count 	    INTEGER,
	IN in_last_modified_by	 BIGINT,
	OUT out_retialer_id BIGINT
)
RETURNS BIGINT AS $$
BEGIN
    INSERT INTO retailer 
	(	
	retialer_user_id,
	retialer_tax_identification_num,
	retialer_bank_account_num,
	retialer_iban,
	retialer_compliance_indicator,
	retialer_complaint_count,
	retialer_positive_review_count,	
	last_modification_date,
	last_modified_by
	)
	VALUES 
	(
	in_retialer_user_id,
	in_retialer_tax_identification_num ,
	in_retialer_bank_account_num,
	in_retialer_iban,
	in_retialer_compliance_indicator ,
	in_retialer_complaint_count 	 ,
	CURRENT_TIMESTAMP,
	in_last_modified_by
	) RETURNING CAST(retialer_id AS BIGINT) INTO out_retialer_id;

EXCEPTION WHEN OTHERS THEN 
	SET out_retialer_id = -1;	
END;
$$ LANGUAGE plpgsql;

-- UPDATE A Retailer
CREATE OR REPLACE FUNCTION user_update (
	IN in_retialer_id    BIGINT,
	IN in_retialer_user_id    BIGINT,
	IN in_retialer_tax_identification_num    VARCHAR,
	IN in_retialer_bank_account_num    VARCHAR,
	IN in_retialer_iban    VARCHAR,
	IN in_retialer_compliance_indicator FLOAT,
	IN in_retialer_complaint_count 	    INTEGER,
	IN in_last_modified_by	 BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
    UPDATE retailer 
	SET	
	retialer_tax_identification_num = COALESCE(in_retialer_tax_identification_num, retialer_tax_identification_num),
	retialer_bank_account_num= COALESCE(in_retialer_bank_account_num, retialer_bank_account_num),
	retialer_iban= COALESCE(in_retialer_iban, retialer_iban),
	retialer_compliance_indicator= COALESCE(in_retialer_compliance_indicator, retialer_compliance_indicator),
	retialer_complaint_count= COALESCE(in_retialer_complaint_count, retialer_complaint_count),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by)

	WHERE CAST(retialer_id AS BIGINT) = in_retialer_id;
	SET update_res = 0;	

EXCEPTION WHEN OTHERS THEN 
	SET update_res = -1;	
END;
$$ LANGUAGE plpgsql;


-- DELETE A Retailer
CREATE OR REPLACE FUNCTION retialer_delete (
	IN in_retialer_user_id BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
	SELECT user_delete(in_retialer_user_id);
	SET update_res = 0;	
EXCEPTION WHEN OTHERS THEN 
	SET update_res = -1;	
END;
$$ LANGUAGE plpgsql;
