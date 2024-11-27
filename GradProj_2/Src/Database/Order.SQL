
-- TABLE: Order
-- TYPE: Main

CREATE TABLE order_localized ( 
	order_id SERIAL PRIMARY KEY,
	quotation_id 		 BIGINT NOT NULL,
	product_id  		 BIGINT NOT NULL,
	order_quantity   	 FLOAT  NOT NULL,
	order_quantity_unit  VARCHAR(35),
	order_date			    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		BIGINT   NOT NULL,
	CONSTRAINT fk_ordr_quotation_id FOREIGN KEY (quotation_id)
    REFERENCES quotation(quotation_id) ON DELETE CASCADE,
	CONSTRAINT fk_ordr_product_id FOREIGN KEY (product_id)
    REFERENCES product(product_id) ON DELETE CASCADE,
	CONSTRAINT chk_ordr_quantity 	  CHECK(order_quantity >= 0)
);

/*
Order Indexes  / Triggers
*/

-- Order Quotation ID Index
-- to optimize the Retrieval Based on a given Order's Quotation ID
CREATE INDEX  idx_order_quotation_id ON order_localized(quotation_id);

-- Order Product ID Index
-- to optimize the Retrieval Based on a given Order's Product ID
CREATE INDEX  idx_order_product_id ON order_localized(product_id);

/*
 Order CRUD Functions
 */
-- GET AN Order BY ID
CREATE OR REPLACE FUNCTION order_get_by_Id(IN in_order_id BIGINT) 
RETURNS TABLE(
	out_order_id 			 BIGINT,
	out_quotation_id 		 BIGINT,
	out_product_id  		 BIGINT,
	out_order_quantity   	 FLOAT,
	out_order_quantity_unit  VARCHAR,
	out_order_date			    TIMESTAMP,
	out_last_modification_date  TIMESTAMP,
	out_last_modified_by  		BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(order_id AS BIGINT),
	quotation_id,
	product_id,
	order_quantity,
	order_quantity_unit,
	order_date,
	last_modification_date,
	last_modified_by
	FROM	order_localized
	WHERE	CAST(order_id AS BIGINT) = in_order_id;
END;
$$ LANGUAGE plpgsql;
-- GET AN Order BY Quotation
CREATE OR REPLACE FUNCTION order_get_by_quotation(IN in_quotation_id BIGINT) 
RETURNS TABLE(
	out_order_id 			 BIGINT,
	out_product_id  		 BIGINT,
	out_order_quantity   	 FLOAT,
	out_order_quantity_unit  VARCHAR,
	out_order_date			    TIMESTAMP,
	out_last_modification_date  TIMESTAMP,
	out_last_modified_by  		BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(order_id AS BIGINT),
	product_id,
	order_quantity,
	order_quantity_unit,
	order_date,
	last_modification_date,
	last_modified_by
	FROM	order_localized
	WHERE	CAST(quotation_id AS BIGINT) = in_quotation_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT AN Order
CREATE OR REPLACE FUNCTION order_insert (
	IN in_quotation_id 		 BIGINT,
	IN in_product_id  		 BIGINT,
	IN in_order_quantity   	 FLOAT,
	IN in_order_quantity_unit  VARCHAR,
	IN in_order_date			    TIMESTAMP,
	IN in_last_modification_date  TIMESTAMP,
	IN in_last_modified_by  		BIGINT,
	OUT out_order_id BIGINT
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
		order_localized (
			quotation_id 		 ,
			product_id  		 ,
			order_quantity   	 ,
			order_quantity_unit  ,
			order_date			  ,
			last_modification_date,
			last_modified_by 
		)
	VALUES
		(
			in_quotation_id,
			in_product_id,
			in_order_quantity,
			in_order_quantity_unit,
			in_order_date,
			CURRENT_TIMESTAMP,
			in_last_modified_by
	) RETURNING CAST(order_id AS BIGINT) INTO out_order_id;
EXCEPTION
WHEN OTHERS THEN 
	out_order_id := -1;
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