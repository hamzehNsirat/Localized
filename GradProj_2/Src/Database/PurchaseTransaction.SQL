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
