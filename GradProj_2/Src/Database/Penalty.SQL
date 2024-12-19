-- TABLE: Penalty
-- TYPE: Main

CREATE TABLE penalty ( 
	penalty_id SERIAL PRIMARY KEY,
	penalty_type_id    BIGINT,
	establishment_id   BIGINT NOT NULL,
	penalty_initiator_id BIGINT,
	penalty_status_id 	 VARCHAR(15) NOT NULL DEFAULT 'CREATED',
	penalty_notes  TEXT,
	creation_date  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	 penalty_title VARCHAR(254) DEFAULT NULL,
	CONSTRAINT fk_pnlt_establishment_id FOREIGN KEY (establishment_id)
    REFERENCES establishment(establishment_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_pnlt_initiator_id FOREIGN KEY (penalty_initiator_id)
    REFERENCES adminstrator(admin_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_pnlt_type_id FOREIGN KEY (penalty_type_id)
    REFERENCES penalty_type(penalty_type_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_pnlt_status CHECK(penalty_status_id IN('CREATED', 'APPLIED', 'POSTPONED', 'DISABLED'))
);
/*
Penalty Indexes  / Triggers
*/

-- Penalty Status ID Index
-- to optimize the Retrieval Based on a given Penalty's Status ID
CREATE INDEX  idx_penalty_status_id ON penalty(penalty_status_id);

-- Penalty Establishment Index
-- to optimize the Retrieval Based on a given Penalty's  Establishment ID
CREATE INDEX  idx_fk_establishment_id ON penalty(establishment_id);


/*
 Penalty CRUD Functions
*/
-- GET A Penalty BY ID
CREATE OR REPLACE FUNCTION penalty_get_all(IN page_size INT, IN page_index INT) 
RETURNS TABLE (
	out_penalty_id		   BIGINT, 
	out_penalty_type_id    BIGINT,
	out_establishment_id   BIGINT ,
	out_penalty_initiator_id BIGINT,
	out_penalty_status_id 	 VARCHAR,
	out_creation_date  TIMESTAMP 
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(D.penalty_id AS BIGINT),	
	CAST(D.penalty_type_id AS BIGINT),
	CAST(D.establishment_id AS BIGINT),
	CAST(D.penalty_initiator_id AS BIGINT),
	D.penalty_status_id,
	D.creation_date
	FROM	penalty AS D;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION penalty_get_by_id(IN in_penalty_id BIGINT) 
RETURNS TABLE (
	out_penalty_type_id    BIGINT,
	out_establishment_id   BIGINT,
	out_establishment_name VARCHAR,
	out_establishment_type VARCHAR,
	out_establishment_status_id BIGINT,
	out_establishment_status VARCHAR,
	out_penalty_initiator_id BIGINT,
	out_penalty_status_id VARCHAR,
	out_penalty_notes TEXT,
	out_creation_date TIMESTAMP,
	out_last_modification_date TIMESTAMP,
	out_last_modified_by BIGINT
) 
AS $$ 
BEGIN 
    RETURN QUERY
    SELECT
        D.penalty_type_id,
        D.establishment_id,
        CAST(L.establishment_name AS VARCHAR),
        CAST(CASE 
            WHEN CAST(L.establishment_type AS BOOLEAN) = TRUE THEN 'RetailStore' 
            ELSE 'Factory' 
        END  AS VARCHAR),
        L.establishment_status,
        M.establishment_status,
        D.penalty_initiator_id,
        D.penalty_status_id,
        D.penalty_notes,
        D.creation_date,
        D.last_modification_date,
        D.last_modified_by
    FROM 
        penalty AS D
    JOIN 
        establishment AS L ON D.establishment_id = L.establishment_id
    JOIN 
        establishment_status AS M ON L.establishment_status = M.establishment_status_id
    WHERE 
        CAST(D.penalty_id AS BIGINT) = in_penalty_id;
END;
$$ LANGUAGE plpgsql;
-- GET A Penalty BY Establishment
CREATE OR REPLACE FUNCTION penalty_get_by_establishment(IN in_establishment_id BIGINT) 
RETURNS TABLE (
	out_penalty_id		  	 BIGINT,
	out_penalty_type_id      BIGINT,
	out_establishment_id  	 BIGINT ,
	out_penalty_initiator_id BIGINT,
	out_penalty_status_id 	 VARCHAR,
	out_penalty_notes  		 TEXT,
	out_creation_date  		 TIMESTAMP ,
	out_last_modification_date   TIMESTAMP,
	out_last_modified_by		 BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(penalty_id AS BIGINT),
	penalty_type_id,
	establishment_id,
	penalty_initiator_id,
	penalty_status_id,
	penalty_notes,
	creation_date,
	last_modification_date,
	last_modified_by
	FROM	penalty
	WHERE	CAST(establishment_id AS BIGINT) = in_establishment_id;
END;
$$ LANGUAGE plpgsql;


-- INSERT A Penalty
CREATE OR REPLACE FUNCTION penalty_insert(
	IN in_penalty_type_id        BIGINT,
	IN in_establishment_id  	 BIGINT ,
	IN in_penalty_initiator_id   BIGINT,
	IN in_penalty_status_id 	 VARCHAR,
	IN in_penalty_notes  		 TEXT,
	IN in_creation_date  		 TIMESTAMP ,
	IN in_last_modified_by	   	 BIGINT,
	OUT out_penalty_id     BIGINT
)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
	INSERT INTO penalty (
		penalty_type_id,
		establishment_id,
		penalty_initiator_id,
		penalty_status_id,
		penalty_notes,
		creation_date,
		last_modification_date,
		last_modified_by
	) VALUES
	( 
		in_penalty_type_id,
		in_establishment_id,
		in_penalty_initiator_id,
		in_penalty_status_id,
		in_penalty_notes,
		in_creation_date,
		CURRENT_TIMESTAMP,
		in_last_modified_by
	) RETURNING CAST(penalty_id AS BIGINT) INTO out_penalty_id;

EXCEPTION WHEN OTHERS THEN 

	out_penalty_id := -1;	
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

-- UPDATE A Penalty
CREATE OR REPLACE FUNCTION penalty_update (
	IN in_penalty_id		  	 BIGINT,
	IN in_penalty_type_id        BIGINT,
	IN in_establishment_id  	 BIGINT ,
	IN in_penalty_initiator_id   BIGINT,
	IN in_penalty_status_id 	 VARCHAR,
	IN in_penalty_notes  		 TEXT,
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
	UPDATE penalty SET
		penalty_type_id  = 		COALESCE(in_penalty_type_id, penalty_type_id),
		establishment_id = 		COALESCE(in_establishment_id, establishment_id),
		penalty_initiator_id = 		COALESCE(in_penalty_initiator_id, penalty_initiator_id),
		penalty_status_id =		COALESCE(in_penalty_status_id, penalty_status_id),
		penalty_notes =		COALESCE(in_penalty_notes, penalty_notes),
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



-- DELETE A Penalty
CREATE OR REPLACE FUNCTION penalty_delete (
	IN in_penalty_id		  	 BIGINT,
	IN in_last_modified_by	   	 BIGINT
)
RETURNS BIGINT AS $$
BEGIN
	UPDATE penalty SET
		penalty_status_id =	'DISABLED',
		last_modified_by  = in_last_modified_by
	WHERE CAST(penalty_id AS BIGINT) = in_penalty_id;
	RETURN 0;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1;	
END;
$$ LANGUAGE plpgsql;