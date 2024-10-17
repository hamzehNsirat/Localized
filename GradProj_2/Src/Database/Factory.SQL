-- TABLE: Factory
-- TYPE: Main

CREATE TABLE factory ( 
	owner_id 				 BIGINT NOT NULL,
	factory_est_id           BIGINT NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_factory_owner_id FOREIGN KEY (owner_id)
    REFERENCES supplier(supplier_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_factory_establishment_id FOREIGN KEY (factory_est_id) 
    REFERENCES establishment(establishment_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT pk_factory_id PRIMARY KEY (owner_id, factory_est_id) 
);
