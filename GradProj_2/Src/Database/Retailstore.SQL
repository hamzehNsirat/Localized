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

/*
retailstore Indexes  / Triggers
*/

-- retailstore Owner ID Index
CREATE INDEX  idx_retailstore_owner_id ON retailstore(owner_id);

/*
retailstore CRUD Functions
*/

-- GET Owned Factories
CREATE OR REPLACE FUNCTION retailstore_owned_insert (
	IN in_owner_id BIGINT,
	IN in_retailstore_est_id BIGINT
)
RETURNS INTEGER
AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
    INSERT INTO retailstore
	(	
	owner_id,
	retailstore_est_id,
	last_modification_date,
	last_modified_by
	)
	VALUES
	(
	in_owner_id,
	in_retailstore_est_id,
	CURRENT_TIMESTAMP,
	1	
	);
	RETURN 0 AS execution_result;	
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
	get stacked diagnostics
	v_state = returned_sqlstate,
	v_msg = message_text,
	v_detail = pg_exception_detail,
	v_context = pg_exception_context;
        
    raise notice E' Got exception:
    state: % 
    message: % 
    detail: %
    hint: %
    context: %',  v_state, v_msg, v_detail, v_hint, v_context;
END;
$$ LANGUAGE plpgsql;
-- GET Owned Factories
CREATE OR REPLACE FUNCTION retailstore_owned_get (
	IN in_owner_id BIGINT
)
RETURNS TABLE(		
	retailstore_est_id           BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	f.retailstore_est_id
	FROM retailstore f WHERE f.owner_id = in_owner_id;
END;
$$ LANGUAGE plpgsql;

-- GET Owned Factories Industry Type
CREATE OR REPLACE FUNCTION retailstore_industry_get (
	retailstore_est_id           BIGINT
)
RETURNS TABLE(		
	industry_type_id INTEGER,
	industry_type VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
	SELECT * FROM
	(SELECT * FROM industry_type_get_by_id (
	ARRAY[(SELECT e.industry_type_spec FROM establishment e WHERE e.establishment_id = retailstore_est_id)]
	));
END;
$$ LANGUAGE plpgsql;
-- GET Owned Factories Industry Type Categories
CREATE OR REPLACE FUNCTION retailstore_categories_get (
	retailstore_est_id           BIGINT
)
RETURNS TABLE(		
	out_category_id INTEGER,
	out_category_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
	SELECT category_id, category_name
	FROM  category WHERE  industry_type =  ANY(SELECT industry_type_id FROM retailstore_industry_get(retailstore_est_id));
END;
$$ LANGUAGE plpgsql;
