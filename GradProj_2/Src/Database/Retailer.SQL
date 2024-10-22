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