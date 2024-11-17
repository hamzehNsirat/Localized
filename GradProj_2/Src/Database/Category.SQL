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

CREATE OR REPLACE FUNCTION category_get_by_industry(IN in_industry_type BIGINT) 
RETURNS TABLE (
	in_category_name  		   VARCHAR, 
	in_last_modification_date  TIMESTAMP,
	in_last_modified_by		   BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	category_name, 
	last_modification_date,
	last_modified_by
	FROM	category
	WHERE	CAST(industry_type AS BIGINT) = in_industry_type;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION category_get_by_id(IN in_category_id BIGINT) 
RETURNS TABLE (
	in_industry_type    	   BIGINT, 
	in_category_name  		   VARCHAR, 
	in_last_modification_date  TIMESTAMP,
	in_last_modified_by		   BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	industry_type, 
	category_name, 
	last_modification_date,
	last_modified_by
	FROM	category
	WHERE	CAST(category_id AS BIGINT) = in_category_id;
END;
$$ LANGUAGE plpgsql;

-- INSERT A Category
CREATE OR REPLACE FUNCTION category_insert (
	in_industry_type    		BIGINT, 
	in_category_name    		VARCHAR,
	in_last_modified_by		 	BIGINT,
	OUT out_category_id 			BIGINT
) 
RETURNS BIGINT 
AS $$ 
DECLARE 
v_state TEXT;
v_msg TEXT;
v_detail TEXT;
v_hint TEXT;
v_context TEXT;
BEGIN
	INSERT INTO
		category (
			industry_type,
			category_name,
			last_modification_date,
			last_modified_by
		)
	VALUES
		(
			in_industry_type, 
			in_category_name,
			CURRENT_TIMESTAMP,
			in_last_modified_by
	) RETURNING CAST(category_id AS BIGINT) INTO out_category_id;
EXCEPTION
WHEN OTHERS THEN 
	out_category_id := -1;
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