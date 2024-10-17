-- TABLE: Inventory
-- TYPE: Main

CREATE TABLE establishment_inventory ( 
	establishment_inventory_id SERIAL PRIMARY KEY,
	establishment_id    BIGINT NOT NULL,
	quantity_available FLOAT NOT NULL,
	inventory_type TEXT NOT NULL DEFAULT 'NOT SPECIFIED',
	inventory_measurement_unit VARCHAR(20) NOT NULL DEFAULT 'NOT SPECIFIED',
	reorder_threshold FLOAT NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_owner_establishment_id FOREIGN KEY (establishment_id) 
    REFERENCES establishment(establishment_id) ON DELETE SET NULL ON UPDATE CASCADE
);
