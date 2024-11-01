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
/*
Factory Indexes  / Triggers
*/

-- Factory Owner ID Index
CREATE INDEX  idx_factory_owner_id ON factory(owner_id);

/*
Factory CRUD Functions
*/

-- GET Owned Factories
CREATE OR REPLACE FUNCTION factory_owned_get (
	IN owner_id BIGINT
)
RETURNS TABLE(		
	factory_est_id           BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	f.factory_est_id
	FROM factory f WHERE f.owner_id = owner_id;
END;
$$ LANGUAGE plpgsql;

-- GET Owned Factories Industry Type
CREATE OR REPLACE FUNCTION factory_industry_get (
	factory_est_id           BIGINT
)
RETURNS TABLE(		
	industry_type_id BIGINT,
	industry_type VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
	SELECT industry_type_id, industry_type 
	FROM industry_type_get_by_id (
	(SELECT e.industry_type FROM establishment e WHERE e.establishment_id = factory_est_id)
	);
END;
$$ LANGUAGE plpgsql;
-- GET Owned Factories Industry Type Categories
CREATE OR REPLACE FUNCTION factory_categories_get (
	factory_est_id           BIGINT
)
RETURNS TABLE(		
	category_id BIGINT,
	category_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
	SELECT category_id, category_name 
	FROM  category WHERE  industry_type =  (SELECT industry_type_id FROM factory_industry_get(factory_est_id));
END;
$$ LANGUAGE plpgsql;