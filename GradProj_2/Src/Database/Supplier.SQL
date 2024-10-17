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
	CONSTRAINT fk_supplier_user_id FOREIGN KEY (supplier_user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT chk_supp_compliance_ind CHECK(supplier_compliance_indicator BETWEEN 0 AND 1),
	CONSTRAINT chk_supp_compliance_cnt CHECK(supplier_compliance_count >= 0),
	CONSTRAINT chk_supp_posrev_cnt     CHECK(supplier_positive_review_count >= 0)
);
