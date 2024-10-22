-- TABLE: Retailstore
-- TYPE: Main

CREATE TABLE retailstore ( 
	owner_id   				 BIGINT NOT NULL,
	retailstore_est_id       BIGINT NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_retailstore_owner_id FOREIGN KEY (owner_id)
    REFERENCES supplier(supplier_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_retailstore_establishment_id FOREIGN KEY (retailstore_est_id) 
    REFERENCES establishment(establishment_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT pk_retailstore_id PRIMARY KEY (owner_id, retailstore_est_id) 
);
