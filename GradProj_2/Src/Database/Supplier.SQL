-- TABLE: Supplier
-- TYPE: Main

CREATE TABLE supplier ( 
	supplier_id SERIAL PRIMARY KEY,
	supplier_user_id    BIGINT NOT NULL,
	supplier_tax_identification_num    VARCHAR(8) NOT NULL UNIQUE,
	supplier_bank_account_num    VARCHAR(18) UNIQUE,
	supplier_iban    VARCHAR(34)  NOT NULL UNIQUE,
	supplier_compliance_indicator FLOAT NOT NULL DEFAULT 0,
	supplier_compliance_count 	    INTEGER NOT NULL DEFAULT 0,
	supplier_positive_review_count INTEGER NOT NULL DEFAULT 0,	
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	supplier_overall_rating  INTEGER DEFAULT NULL,
	CONSTRAINT fk_supplier_user_id FOREIGN KEY (supplier_user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT chk_supp_compliance_ind CHECK(supplier_compliance_indicator BETWEEN 0 AND 1),
	CONSTRAINT chk_supp_compliance_cnt CHECK(supplier_compliance_count >= 0),
	CONSTRAINT chk_supp_posrev_cnt     CHECK(supplier_positive_review_count >= 0)
);

/*
Supplier Indexes  / Triggers
*/

-- Supplier User ID Index
-- to optimize the Retrieval Based on a given Supplier's UserID
CREATE INDEX  idx_fk_suppuser_id ON supplier(supplier_user_id);

-- Supplier TIN Index
-- to optimize the Retrieval Based on a given Supplier's TIN
CREATE INDEX  idx_fk_supp_tin ON supplier(supplier_tax_identification_num);

-- Supplier Compliance Indicator Index
-- to optimize the Retrieval Based on a given Supplier's UserID
CREATE INDEX  idx_fk_supp_compliance ON supplier(supplier_compliance_indicator);

/*
Supplier CRUD Functions
*/
-- GET A Supplier BY ID
CREATE OR REPLACE FUNCTION supplier_get_by_id(IN in_supplier_id BIGINT)
RETURNS TABLE(		
	out_supplier_user_id    BIGINT,
	out_supplier_tax_identification_num    VARCHAR,
	out_supplier_bank_account_num    VARCHAR,
	out_supplier_iban    VARCHAR,
	out_supplier_compliance_indicator FLOAT,
	out_supplier_complaint_count 	    INTEGER,
	out_supplier_positive_review_count INTEGER,
	out_supplier_overall_rating INTEGER

) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	supplier_user_id,
	supplier_tax_identification_num,
	supplier_bank_account_num,
	supplier_iban,
	supplier_compliance_indicator,
	supplier_complaint_count 	,
	supplier_positive_review_count,
	supplier_overall_rating
	FROM supplier
	WHERE CAST(supplier_id AS BIGINT) = in_supplier_id;
END;
$$ LANGUAGE plpgsql;
-- GET A Supplier Statistics 
CREATE OR REPLACE FUNCTION get_supplier_compliance_statistics (
IN in_supplier_id BIGINT
)
RETURNS TABLE(		
	out_supplier_compliance_indicator FLOAT,
	out_supplier_complaint_count 	    INTEGER,
	out_supplier_positive_review_count INTEGER,
	out_supplier_overall_rating INTEGER
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	supplier_compliance_indicator,
	supplier_complaint_count 	,
	supplier_positive_review_count,
	supplier_overall_rating
	FROM supplier
	WHERE CAST(supplier_id AS BIGINT) = in_supplier_id;
END;
$$ LANGUAGE plpgsql;

-- INSERT A Supplier
CREATE OR REPLACE FUNCTION supplier_insert (
	IN in_supplier_user_id    BIGINT,
	IN in_supplier_tax_identification_num    VARCHAR,
	IN in_supplier_bank_account_num    VARCHAR,
	IN in_supplier_iban    VARCHAR,
	IN in_supplier_compliance_indicator FLOAT,
	IN in_supplier_complaint_count 	    INTEGER,
	IN in_supplier_positive_review_count INTEGER,
	IN in_last_modified_by	 BIGINT,
	OUT out_supplier_id BIGINT
)
RETURNS BIGINT AS $$
BEGIN
    INSERT INTO supplier 
	(	
	supplier_user_id,
	supplier_tax_identification_num,
	supplier_bank_account_num,
	supplier_iban,
	supplier_compliance_indicator,
	supplier_complaint_count,
	supplier_positive_review_count,	
	last_modification_date,
	last_modified_by
	)
	VALUES 
	(
	in_supplier_user_id,
	in_supplier_tax_identification_num ,
	in_supplier_bank_account_num,
	in_supplier_iban,
	in_supplier_compliance_indicator ,
	in_supplier_complaint_count 	 ,
	in_supplier_positive_review_count,
	CURRENT_TIMESTAMP,
	in_last_modified_by
	) RETURNING CAST(supplier_id AS BIGINT) INTO out_supplier_id;

EXCEPTION WHEN OTHERS THEN 
	out_supplier_id := -1;	
END;
$$ LANGUAGE plpgsql;

-- UPDATE A Supplier
CREATE OR REPLACE FUNCTION supplier_update (
	IN in_supplier_id    BIGINT,
	IN in_supplier_user_id    BIGINT,
	IN in_supplier_tax_identification_num    VARCHAR,
	IN in_supplier_bank_account_num    VARCHAR,
	IN in_supplier_iban    VARCHAR,
	IN in_supplier_compliance_indicator FLOAT,
	IN in_supplier_complaint_count 	    INTEGER,
	IN in_supplier_positive_review_count INTEGER,
	IN in_last_modified_by	 BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
    UPDATE supplier 
	SET	
	supplier_tax_identification_num = COALESCE(in_supplier_tax_identification_num, supplier_tax_identification_num),
	supplier_bank_account_num= COALESCE(in_supplier_bank_account_num, supplier_bank_account_num),
	supplier_iban= COALESCE(in_supplier_iban, supplier_iban),
	supplier_compliance_indicator= COALESCE(in_supplier_compliance_indicator, supplier_compliance_indicator),
	supplier_complaint_count= COALESCE(in_supplier_complaint_count, supplier_complaint_count),
	supplier_positive_review_count= COALESCE(in_supplier_positive_review_count, supplier_positive_review_count),	
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by)

	WHERE CAST(supplier_id AS BIGINT) = in_supplier_id;
	SET update_res = 0;	

EXCEPTION WHEN OTHERS THEN 
	 update_res := -1;	
END;
$$ LANGUAGE plpgsql;


-- DELETE A Supplier
CREATE OR REPLACE FUNCTION supplier_delete (
	IN in_supplier_user_id BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
	SELECT user_delete(in_supplier_user_id);
	SET update_res = 0;	
EXCEPTION WHEN OTHERS THEN 
	 update_res := -1;	
END;
$$ LANGUAGE plpgsql;