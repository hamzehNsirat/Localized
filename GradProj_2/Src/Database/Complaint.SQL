-- TABLE: Complaint
-- TYPE: Main

CREATE TABLE complaint ( 
	complaint_id SERIAL PRIMARY KEY,
	complaint_type_id    BIGINT,
	reviewer_id BIGINT,
	supplier_id   BIGINT NOT NULL,
	retailer_id   BIGINT NOT NULL,
	complaint_status_id 	 VARCHAR(15) NOT NULL DEFAULT 'CREATED',
	complaint_notes  TEXT,
	submitter_type   BOOLEAN NOT NULL,
	creation_date  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	quotation_id BIGINT NOT NULL,
	resolution_notes  TEXT,
	complaint_title VARCHAR(400) DEFAULT 'default',
	CONSTRAINT fk_cmpn_rtlr_id FOREIGN KEY (retailer_id)
    REFERENCES retailer(retailer_id) ON DELETE CASCADE,
	CONSTRAINT fk_cmpn_supp_id FOREIGN KEY (supplier_id)
    REFERENCES supplier(supplier_id) ON DELETE CASCADE,
	CONSTRAINT fk_cmpn_reviewer_id FOREIGN KEY (reviewer_id)
    REFERENCES adminstrator(admin_id) ON DELETE SET NULL,
	CONSTRAINT fk_cmpn_type_id FOREIGN KEY (complaint_type_id)
    REFERENCES complaint_type(complaint_type_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_cmpn_qttn_id FOREIGN KEY (quotation_id)
    REFERENCES quotation(quotation_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_cmpn_status CHECK(complaint_status_id IN('CREATED', 'REVIEWED', 'RESOLVED', 'DELETED'))
);

/*
Complaint Indexes  / Triggers
*/

-- Complaint Supplier ID Index
-- to optimize the Retrieval Based on a given Complaint's Supplier ID
CREATE INDEX  idx_cmplnt_supplier_id ON complaint(supplier_id);

-- Complaint  ID Index
-- to optimize the Retrieval Based on a given Complaint's Retailer ID
CREATE INDEX  idx_cmplnt_retailer_id ON complaint(retailer_id);

/*
 Complaint CRUD Functions
*/
-- GET A Complaint BY ID
CREATE OR REPLACE FUNCTION complaint_get_all(IN page_size INT, IN page_index INT) 
RETURNS TABLE (
	out_complaint_id		   BIGINT, 
	out_complaint_title 		VARCHAR,
	out_complaint_type_id    BIGINT,
	out_complaint_supplier_id   BIGINT ,
	out_complaint_retailer_id BIGINT,
	out_complaint_status_id 	 VARCHAR,
	out_quotation_id BIGINT,
	out_creation_date  TIMESTAMP 
) 
AS $$ BEGIN RETURN QUERY
	SELECT 
	CAST(D.complaint_id AS BIGINT),	
	D.complaint_title,
	CAST(D.complaint_type_id AS BIGINT),
	CAST(D.supplier_id AS BIGINT),
	CAST(D.retailer_id AS BIGINT),
	D.complaint_status_id,
	D.quotation_id,
	D.creation_date
	FROM	complaint AS D
	ORDER BY creation_date DESC
	LIMIT page_size
	OFFSET ((page_index - 1) * page_size) ;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION complaint_get_by_id(IN in_complaint_id BIGINT) 
RETURNS TABLE (
	out_complaint_id  BIGINT,
	out_complaint_title  VARCHAR,
	out_complaint_type_id    BIGINT,
	out_quotation_id    BIGINT,
	out_reviewer_id BIGINT,
	out_supplier_id   BIGINT,
	out_retailer_id   BIGINT,
	out_complaint_status_id   VARCHAR,
	out_complaint_notes  TEXT,
	out_submitter_type   BOOLEAN,
	out_creation_date  TIMESTAMP,
	out_resolution_notes  TEXT
) 
AS $$ 
BEGIN 
    RETURN QUERY
    SELECT 
	CAST(complaint_id AS BIGINT), 
	complaint_title,
	complaint_type_id , 
	quotation_id,
	reviewer_id , 
	supplier_id , 
	retailer_id , 
	complaint_status_id , 
	complaint_notes  , 
	submitter_type  , 
	creation_date  , 
	resolution_notes
    FROM 
        complaint 
    WHERE 
        CAST(complaint_id AS BIGINT) = in_complaint_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_complaints_by_retailer(
  IN in_retailer_id BIGINT,
  IN in_page_size INTEGER,
  IN in_page_index INTEGER
)
RETURNS TABLE(
  complaint_id BIGINT,
  complaint_title VARCHAR,
  complaint_date TIMESTAMP,
  complaint_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CAST(c.complaint_id AS BIGINT),
    c.complaint_title, 
    c.creation_date,
    c.complaint_status_id
  FROM
    complaint c
  WHERE
    c.retailer_id = in_retailer_id
  ORDER BY
    c.creation_date DESC
  LIMIT in_page_size
  OFFSET ((in_page_index - 1) * in_page_size);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_complaints_by_supplier(
  IN in_supplier_id BIGINT,
  IN in_page_size INTEGER,
  IN in_page_index INTEGER
)
RETURNS TABLE(
  complaint_id BIGINT,
  complaint_title VARCHAR,
  complaint_date TIMESTAMP,
  complaint_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CAST(c.complaint_id AS BIGINT),
    c.complaint_title, 
    c.creation_date,
    c.complaint_status_id
  FROM
    complaint c
  WHERE
    c.supplier_id = in_supplier_id
  ORDER BY
    c.creation_date DESC
  LIMIT in_page_size
  OFFSET ((in_page_index - 1) * in_page_size);
END;
$$ LANGUAGE plpgsql;
-- INSERT A Complaint
CREATE OR REPLACE FUNCTION complaint_insert(
	IN in_complaint_title VARCHAR,
	IN in_complaint_type_id    BIGINT,	
	IN in_reviewer_id BIGINT,
	IN in_supplier_id   BIGINT,
	IN in_retailer_id   BIGINT,
	IN in_complaint_status_id 	 VARCHAR,
	IN in_complaint_notes  TEXT,
	IN in_submitter_type   BOOLEAN,
	IN in_creation_date  TIMESTAMP,
	IN in_last_modified_by		 BIGINT,
	IN in_resolution_notes  TEXT,
	IN in_quotation_id BIGINT,
	OUT out_complaint_id     BIGINT
)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
	INSERT INTO complaint (
		complaint_type_id , 
		reviewer_id , 
		supplier_id , 
		retailer_id , 
		complaint_status_id , 
		complaint_notes  , 
		submitter_type  , 
		creation_date  , 
		last_modification_date ,
		last_modified_by,
		resolution_notes,
		quotation_id,
		complaint_title
	) VALUES
	( 
		in_complaint_type_id , 
		in_reviewer_id , 
		in_supplier_id , 
		in_retailer_id , 
		in_complaint_status_id , 
		in_complaint_notes  , 
		in_submitter_type  , 
		CURRENT_TIMESTAMP, 
		CURRENT_TIMESTAMP,
		in_last_modified_by,
		in_resolution_notes,
		in_quotation_id,
		in_complaint_title
	) RETURNING CAST(complaint_id AS BIGINT) INTO out_complaint_id;

EXCEPTION WHEN OTHERS THEN 

	out_complaint_id := -1;	
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

-- UPDATE A Complaint
CREATE OR REPLACE FUNCTION complaint_update (
	IN in_reviewer_id BIGINT,
	IN in_complaint_status_id 	 VARCHAR,
	IN in_last_modified_by		 BIGINT,
	IN in_resolution_notes  TEXT,
	IN in_complaint_id     BIGINT
)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
	UPDATE complaint SET
		reviewer_id = COALESCE(in_reviewer_id,reviewer_id) , 
		complaint_status_id = COALESCE(in_complaint_status_id, complaint_status_id) , 
		last_modification_date =CURRENT_TIMESTAMP,
		last_modified_by= COALESCE(in_last_modified_by, last_modified_by),
		resolution_notes=COALESCE(in_resolution_notes, resolution_notes);
	RETURN 0;
EXCEPTION WHEN OTHERS THEN 

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



-- DELETE A Complaint
CREATE OR REPLACE FUNCTION complaint_delete (
	IN in_complaint_id		  	 BIGINT,
	IN in_last_modified_by	   	 BIGINT
)
RETURNS BIGINT AS $$
BEGIN
	UPDATE complaint SET
		complaint_status_id =	'DELETED',
		last_modified_by  = in_last_modified_by
	WHERE CAST(complaint_id AS BIGINT) = in_complaint_id;
	RETURN 0;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1;	
END;
$$ LANGUAGE plpgsql;