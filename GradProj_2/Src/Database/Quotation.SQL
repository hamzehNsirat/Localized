-- TABLE: Quotation
-- TYPE: Main

CREATE TABLE quotation ( 
	quotation_id SERIAL PRIMARY KEY,
	requester_id 		 BIGINT NOT NULL,
	supplier_id 		 BIGINT NOT NULL,
	quotation_status_id  BIGINT NOT NULL,
	quotation_request_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	quotation_details     JSONB,
	quotation_attachments JSONB,
	from_establishment_name	  TEXT  NOT NULL,
	to_establishment_name	  TEXT  NOT NULL,
	ship_to_address		      TEXT  NOT NULL,
	bill_to_address		      TEXT  NOT NULL,
	supplier_address		  TEXT,
	last_updater_type		BOOLEAN   NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		BIGINT    NOT NULL,
	shipping_cost FLOAT DEFAULT NULL,
	sub_total FLOAT DEFAULT NULL,
	total FLOAT DEFAULT NULL,
	CONSTRAINT fk_qotn_supplier_id FOREIGN KEY (supplier_id)
    REFERENCES supplier(supplier_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_qotn_retailer_id FOREIGN KEY (requester_id)
    REFERENCES retailer(retailer_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_qotn_status_id FOREIGN KEY (quotation_status_id)
    REFERENCES quotation_status(quotation_status_id) ON DELETE SET NULL ON UPDATE CASCADE,

	CONSTRAINT chk_qotn_addrs 	  CHECK(ship_to_address <> supplier_address AND bill_to_address <> supplier_address),
	CONSTRAINT chk_qotn_name 	  CHECK(from_establishment_name <> to_establishment_name)
);
/*
Quotation Indexes  / Triggers
*/

-- Quotation Supplier ID Index
-- to optimize the Retrieval Based on a given Quotation's Supplier ID
CREATE INDEX  idx_qotn_supplier_id ON quotation(supplier_id);

-- Quotation Retailer ID Index
-- to optimize the Retrieval Based on a given Quotation's Retailer ID
CREATE INDEX  idx_qotn_retailer_id ON quotation(requester_id);

/*
Quotation CRUD Functions
*/
-- GET A Quotation ALL DATA
CREATE OR REPLACE FUNCTION quotation_get_all_data(in_quotation_id BIGINT) 
RETURNS TABLE (
	out_quotation_id 		 BIGINT,
	out_requester_id 		 BIGINT,
	out_supplier_id 		 BIGINT,
	out_quotation_status_id  BIGINT,
	out_quotation_request_date   TIMESTAMP,
	out_quotation_details    	 JSONB,
	out_quotation_attachments 	 JSONB,
	out_related_payment_referenece_no		VARCHAR,
	out_related_payment_reconciliation_no	VARCHAR,
	out_related_payment_latest_trx_id		VARCHAR,
	out_shipping_cost	FLOAT,
	out_sub_total		FLOAT,
	out_total			FLOAT,
	out_from_establishment_name	  TEXT,
	out_to_establishment_name	  TEXT,
	out_has_related_complaints	  INTEGER,
	out_ship_to_address		      TEXT,
	out_bill_to_address		      TEXT,
	out_supplier_address		  TEXT

) 
AS $$ BEGIN RETURN QUERY
	SELECT 

	CAST(D.quotation_id AS BIGINT),
	D.requester_id,
	D.supplier_id,
	D.quotation_status_id,
	D.quotation_request_date,
	D.quotation_details,
	D.quotation_attachments,
	K.payment_reference,
	K.reconciliation_reference,
	CAST(L.purchase_transaction_id AS VARCHAR),
	D.shipping_cost,
	D.sub_total,
	D.total,
	D.from_establishment_name,
	D.to_establishment_name,
	CASE WHEN (SELECT COUNT(*) FROM complaint P WHERE P.quotation_id = D.quotation_id) > 0 THEN 1 ELSE 0 END AS out_has_related_complaints,
	D.ship_to_address,
	D.bill_to_address,
	D.supplier_address

	FROM	quotation AS D
	LEFT JOIN purchase AS K ON K.quotation_id = D.quotation_id
	LEFT JOIN purchase_transaction AS L ON L.purchase_id = K.purchase_id
	WHERE D.quotation_id = in_quotation_id;
END;
$$ LANGUAGE plpgsql;



-- GET A Quotation BY Supplier
CREATE OR REPLACE FUNCTION quotation_get_by_supplier(in_supplier_id 		 	 BIGINT) 
RETURNS TABLE (
	out_quotation_id 		 BIGINT,
	out_requester_id 		 BIGINT,
	out_quotation_status_id  BIGINT ,
	out_quotation_request_date   TIMESTAMP,
	out_quotation_details    	 JSONB,
	out_quotation_attachments 	 JSONB,
	out_shipping_cost	FLOAT,
	out_sub_total		FLOAT,
	out_total			FLOAT,
	out_from_establishment_name	  TEXT,
	out_to_establishment_name	  TEXT,
	out_ship_to_address		      TEXT,
	out_bill_to_address		      TEXT,
	out_supplier_address		  TEXT
) 
AS $$ BEGIN RETURN QUERY
	SELECT 
	CAST(D.quotation_id AS BIGINT),
	D.requester_id,
	D.quotation_status_id,
	D.quotation_request_date,
	D.quotation_details,
	D.quotation_attachments,
	D.shipping_cost	,
	D.sub_total		,
	D.total			,
	D.from_establishment_name,
	D.to_establishment_name,
	D.ship_to_address,
	D.bill_to_address,
	D.supplier_address

	FROM	quotation AS D
	WHERE D.supplier_id = in_supplier_id;
END;
$$ LANGUAGE plpgsql;


-- GET A Quotation BY Retailer
CREATE OR REPLACE FUNCTION quotation_get_by_retailer(in_requester_id 		 BIGINT) 
RETURNS TABLE (
	out_quotation_id 		 BIGINT,
	out_supplier_id 		 BIGINT,
	out_quotation_status_id  BIGINT ,
	out_quotation_request_date   TIMESTAMP,
	out_quotation_details    	 JSONB,
	out_quotation_attachments 	 JSONB,
	out_shipping_cost	FLOAT,
	out_sub_total		FLOAT,
	out_total			FLOAT,
	out_from_establishment_name	  TEXT,
	out_to_establishment_name	  TEXT,
	out_ship_to_address		      TEXT,
	out_bill_to_address		      TEXT,
	out_supplier_address		  TEXT
) 
AS $$ BEGIN RETURN QUERY
	SELECT 
	CAST(D.quotation_id AS BIGINT),
	D.supplier_id,
	D.quotation_status_id,
	D.quotation_request_date,
	D.quotation_details,
	D.quotation_attachments,
	D.shipping_cost	,
	D.sub_total		,
	D.total			,
	D.from_establishment_name,
	D.to_establishment_name,
	D.ship_to_address,
	D.bill_to_address,
	D.supplier_address

	FROM	quotation AS D
	WHERE D.requester_id = in_requester_id;
END;
$$ LANGUAGE plpgsql;
--INSERT A Quotation
CREATE OR REPLACE FUNCTION quotation_insert (
	IN in_requester_id 		 BIGINT , -- from inp
	IN in_supplier_id 		 BIGINT , -- from inp
	IN in_quotation_status_id  BIGINT , -- 1 
	IN in_quotation_details     JSONB, -- from inp
	IN in_quotation_attachments JSONB, -- null
	IN in_from_establishment_name	  TEXT, -- from inp
	IN in_to_establishment_name	  TEXT, -- from inp
	IN in_ship_to_address		      TEXT, -- from inp
	IN in_bill_to_address		      TEXT, -- from inp 
	IN in_supplier_address		  TEXT, -- null
	IN in_last_modified_by		BIGINT, -- 1
	IN in_shipping_cost	FLOAT,
	IN in_sub_total		FLOAT,
	IN in_total			FLOAT,
	OUT out_quotation_id BIGINT
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
		quotation (
	requester_id 		,
	supplier_id 		,
	quotation_status_id ,
	quotation_request_date ,
	quotation_details      ,
	quotation_attachments ,
	from_establishment_name	  ,
	to_establishment_name	  ,
	ship_to_address		      ,
	bill_to_address		      ,
	supplier_address		  ,
	last_updater_type		,
	last_modification_date  ,
	last_modified_by	,	
	shipping_cost	,
	sub_total		,
	total			

		)
	VALUES
		(
		in_requester_id 		  ,
		in_supplier_id 		  ,
		in_quotation_status_id   ,
		CURRENT_TIMESTAMP   ,
		in_quotation_details     ,
		in_quotation_attachments ,
		in_from_establishment_name	  ,
		in_to_establishment_name	  ,
		in_ship_to_address		      ,
		in_bill_to_address		      ,
		in_supplier_address		  ,
		TRUE,
		CURRENT_TIMESTAMP,
		in_last_modified_by,
		in_shipping_cost,
		in_sub_total		,
		in_total			
	) RETURNING CAST(quotation_id AS BIGINT) INTO out_quotation_id;
EXCEPTION
WHEN OTHERS THEN 
	out_quotation_id := -1;
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
-- UPDATE A Quotation Details
CREATE OR REPLACE FUNCTION quotation_update_details (
	IN in_quotation_id  BIGINT ,
	IN in_quotation_details     JSONB,
	IN in_quotation_attachments JSONB,
	IN in_shipping_cost	FLOAT,
	IN in_sub_total		FLOAT,
	IN in_total			FLOAT
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
	UPDATE quotation 

	SET 
	quotation_details = COALESCE(in_quotation_details, quotation_details),
	quotation_attachments = COALESCE(in_quotation_attachments, quotation_attachments),
	shipping_cost = COALESCE(in_shipping_cost, shipping_cost),
	sub_total = COALESCE(in_sub_total, sub_total),
	total = COALESCE(in_total,total)

	WHERE quotation_id = in_quotation_id;
	RETURN 0;
EXCEPTION
WHEN OTHERS THEN 
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
	RETURN -1;
END;
$$ LANGUAGE plpgsql;

-- UPDATE A Quotation Status
CREATE OR REPLACE FUNCTION quotation_update_status (
	IN in_quotation_id  BIGINT ,
	IN in_quotation_status_id  BIGINT 
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
	UPDATE quotation 
	SET quotation_status_id = in_quotation_status_id
	WHERE quotation_id = in_quotation_id;
	RETURN 0;
EXCEPTION
WHEN OTHERS THEN 
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
	RETURN -1;
END;
$$ LANGUAGE plpgsql;

