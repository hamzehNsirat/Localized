-- TABLE: Category
-- TYPE: Look up

CREATE TABLE category ( 
	category_id 	 SERIAL PRIMARY KEY,
	industry_type    BIGINT NOT NULL, 
	category_name    VARCHAR(15) NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_cat_industry_type FOREIGN KEY (industry_type)
	REFERENCES industry_type(industry_type_id) ON DELETE CASCADE ON UPDATE CASCADE
);
/*
Category Indexes / Triggers
*/

-- Category Industry Type Index
-- to optimize the Retrieval Based on a given Category's Industry Type
CREATE INDEX  idx_car_industry_type ON category(industry_type);
