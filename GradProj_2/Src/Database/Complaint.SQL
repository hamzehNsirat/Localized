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
	resolution_notes  TEXT,
	CONSTRAINT fk_cmpn_rtlr_id FOREIGN KEY (retailer_id)
    REFERENCES retailer(retailer_id) ON DELETE CASCADE,
	CONSTRAINT fk_cmpn_supp_id FOREIGN KEY (supplier_id)
    REFERENCES supplier(supplier_id) ON DELETE CASCADE,
	CONSTRAINT fk_cmpn_reviewer_id FOREIGN KEY (reviewer_id)
    REFERENCES adminstrator(admin_id) ON DELETE SET NULL,
	CONSTRAINT fk_cmpn_type_id FOREIGN KEY (complaint_type_id)
    REFERENCES complaint_type(complaint_type_id) ON DELETE SET NULL ON UPDATE CASCADE,
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
CREATE OR REPLACE FUNCTION complaint_get_all() 
RETURNS TABLE (
	out_complaint_id		   BIGINT, 
	out_complaint_type_id    BIGINT,
	out_complaint_supplier_id   BIGINT ,
	out_complaint_retailer_id BIGINT,
	out_complaint_status_id 	 VARCHAR,
	out_creation_date  TIMESTAMP 
) 
AS $$ BEGIN RETURN QUERY
	SELECT 
	CAST(D.complaint_id AS BIGINT),	
	CAST(D.complaint_type_id AS BIGINT),
	CAST(D.supplier_id AS BIGINT),
	CAST(D.retailer_id AS BIGINT),
	D.complaint_status_id,
	D.creation_date
	FROM	complaint AS D;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION complaint_get_by_id(IN in_complaint_id BIGINT) 
RETURNS TABLE (
	out_complaint_type_id    BIGINT,
	out_establishment_id   BIGINT,
	out_establishment_name VARCHAR,
	out_establishment_type VARCHAR,
	out_establishment_status_id BIGINT,
	out_establishment_status VARCHAR,
	out_complaint_initiator_id BIGINT,
	out_complaint_status_id VARCHAR,
	out_complaint_notes TEXT,
	out_creation_date TIMESTAMP,
	out_last_modification_date TIMESTAMP,
	out_last_modified_by BIGINT
) 
AS $$ 
BEGIN 
    RETURN QUERY
    SELECT
        D.complaint_type_id,
        D.establishment_id,
        CAST(L.establishment_name AS VARCHAR),
        CAST(CASE 
            WHEN CAST(L.establishment_type AS BOOLEAN) = TRUE THEN 'RetailStore' 
            ELSE 'Factory' 
        END  AS VARCHAR),
        L.establishment_status,
        M.establishment_status,
        D.complaint_initiator_id,
        D.complaint_status_id,
        D.complaint_notes,
        D.creation_date,
        D.last_modification_date,
        D.last_modified_by
    FROM 
        complaint AS D
    JOIN 
        establishment AS L ON D.establishment_id = L.establishment_id
    JOIN 
        establishment_status AS M ON L.establishment_status = M.establishment_status_id
    WHERE 
        CAST(D.complaint_id AS BIGINT) = in_complaint_id;
END;
$$ LANGUAGE plpgsql;
-- GET A Complaint BY Establishment
CREATE OR REPLACE FUNCTION complaint_get_by_establishment(IN in_establishment_id BIGINT) 
RETURNS TABLE (
	out_complaint_id		  	 BIGINT,
	out_complaint_type_id      BIGINT,
	out_establishment_id  	 BIGINT ,
	out_complaint_initiator_id BIGINT,
	out_complaint_status_id 	 VARCHAR,
	out_complaint_notes  		 TEXT,
	out_creation_date  		 TIMESTAMP ,
	out_last_modification_date   TIMESTAMP,
	out_last_modified_by		 BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(complaint_id AS BIGINT),
	complaint_type_id,
	establishment_id,
	complaint_initiator_id,
	complaint_status_id,
	complaint_notes,
	creation_date,
	last_modification_date,
	last_modified_by
	FROM	complaint
	WHERE	CAST(establishment_id AS BIGINT) = in_establishment_id;
END;
$$ LANGUAGE plpgsql;


-- INSERT A Complaint
CREATE OR REPLACE FUNCTION complaint_insert(
	IN in_complaint_type_id        BIGINT,
	IN in_establishment_id  	 BIGINT ,
	IN in_complaint_initiator_id   BIGINT,
	IN in_complaint_status_id 	 VARCHAR,
	IN in_complaint_notes  		 TEXT,
	IN in_creation_date  		 TIMESTAMP ,
	IN in_last_modified_by	   	 BIGINT,
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
		complaint_type_id,
		establishment_id,
		complaint_initiator_id,
		complaint_status_id,
		complaint_notes,
		creation_date,
		last_modification_date,
		last_modified_by
	) VALUES
	( 
		in_complaint_type_id,
		in_establishment_id,
		in_complaint_initiator_id,
		in_complaint_status_id,
		in_complaint_notes,
		in_creation_date,
		CURRENT_TIMESTAMP,
		in_last_modified_by
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
	IN in_complaint_id		  	 BIGINT,
	IN in_complaint_type_id        BIGINT,
	IN in_establishment_id  	 BIGINT ,
	IN in_complaint_initiator_id   BIGINT,
	IN in_complaint_status_id 	 VARCHAR,
	IN in_complaint_notes  		 TEXT,
	IN in_last_modified_by	   	 BIGINT
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
		complaint_type_id  = 		COALESCE(in_complaint_type_id, complaint_type_id),
		establishment_id = 		COALESCE(in_establishment_id, establishment_id),
		complaint_initiator_id = 		COALESCE(in_complaint_initiator_id, complaint_initiator_id),
		complaint_status_id =		COALESCE(in_complaint_status_id, complaint_status_id),
		complaint_notes =		COALESCE(in_complaint_notes, complaint_notes),
		last_modification_date = CURRENT_TIMESTAMP, 
		last_modified_by =	COALESCE(in_last_modified_by, last_modified_by)
	;
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
		complaint_status_id =	'DISABLED',
		last_modified_by  = in_last_modified_by
	WHERE CAST(complaint_id AS BIGINT) = in_complaint_id;
	RETURN 0;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1;	
END;
$$ LANGUAGE plpgsql;