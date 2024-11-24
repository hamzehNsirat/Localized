-- TABLE: Review
-- TYPE: Main

CREATE TABLE review ( 
	review_id SERIAL PRIMARY KEY,
	supplier_id   BIGINT NOT NULL,
	retailer_id   BIGINT NOT NULL,
	rating  	  INT NOT NULL,
	rating_type   BOOLEAN NOT NULL,
	review_comment  TEXT DEFAULT NULL,
	review_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_revw_rtlr_id FOREIGN KEY (retailer_id)
    REFERENCES retailer(retailer_id) ON DELETE CASCADE,
	CONSTRAINT fk_revw_supp_id FOREIGN KEY (supplier_id)
    REFERENCES supplier(supplier_id) ON DELETE CASCADE,
	CONSTRAINT chk_revw_rating CHECK(rating IN(1, 2, 3, 4, 5))
);
/*
Review Indexes  / Triggers
*/

-- Supplier ID Index
-- to optimize the Retrieval Based on a given Review's Supplier ID
CREATE INDEX  idx_review_supplier ON review(supplier_id);

-- Review Rating Type Trigger
-- to decide type of Review (Positive: TRUE, Negative: FALSE)
CREATE OR REPLACE FUNCTION insert_rating_type()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN			
	IF (NEW.rating IN (3, 4 5)) THEN 
		NEW.rating_type =  TRUE;
	ELSE 
		NEW.rating_type =  FALSE;
	END IF;
	RETURN NEW;
END;
$$

CREATE TRIGGER before_insert_review_rating_type
BEFORE INSERT ON review
FOR EACH ROW
EXECUTE FUNCTION insert_rating_type();

CREATE OR REPLACE FUNCTION review_get_by_supplier(IN in_supplier_id BIGINT) 
RETURNS TABLE (
	out_review_id      BIGINT,
	out_retailer_id    BIGINT,
	out_rating  	   INT,
	out_rating_type    INT,
	out_review_comment TEXT,
	out_review_date    TIMESTAMP
) 
AS $$ 
BEGIN 
    RETURN QUERY
    SELECT 
	review_id 	   ,
	retailer_id    ,
	rating  	   ,
	CASE WHEN rating_type = TRUE THEN 1 ELSE 0 END AS out_rating_type ,
	review_comment ,
	review_date    
    FROM 
        review 
    WHERE 
        CAST(supplier_id AS BIGINT) = in_supplier_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION review_get_by_retailer(IN in_retailer_id BIGINT) 
RETURNS TABLE (
	out_review_id    BIGINT,
	out_retailer_id    BIGINT,
	out_rating  	   INT,
	out_rating_type    INT,
	out_review_comment TEXT,
	out_review_date    TIMESTAMP
) 
AS $$ 
BEGIN 
    RETURN QUERY
    SELECT 
	review_id 	   ,
	supplier_id    ,
	rating  	   ,
	CASE WHEN rating_type = TRUE THEN 1 ELSE 0 END AS out_rating_type ,
	review_comment ,
	review_date    
    FROM 
        review 
    WHERE 
        CAST(retailer_id AS BIGINT) = in_retailer_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION review_get_by_id(IN in_review_id BIGINT) 
RETURNS TABLE (
	out_review_id 	   BIGINT,
	out_supplier_id    BIGINT,
	out_retailer_id    BIGINT,
	out_rating  	   INT,
	out_rating_type    INT,
	out_review_comment TEXT,
	out_review_date    TIMESTAMP
) 
AS $$ 
BEGIN 
    RETURN QUERY
    SELECT 
	review_id 	   ,
	supplier_id    ,
	retailer_id    ,
	rating  	   ,
	CASE WHEN rating_type = TRUE THEN 1 ELSE 0 END AS out_rating_type ,
	review_comment ,
	review_date    
    FROM 
        review 
    WHERE 
        CAST(review_id AS BIGINT) = in_review_id;
END;
$$ LANGUAGE plpgsql;


-- INSERT A review
CREATE OR REPLACE FUNCTION review_insert (
	IN in_supplier_id   			BIGINT,
	IN in_retailer_id   			BIGINT,
	IN in_rating  	  	 			INT,
	IN in_review_comment   		TEXT,
	IN in_review_date              TIMESTAMP,
	IN in_last_modification_date   TIMESTAMP,
	IN in_last_modified_by		 	BIGINT,
	OUT out_review_id     		BIGINT
)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
	INSERT INTO review (
	supplier_id,
	retailer_id,
	rating,
	rating_type,
	review_comment,
	review_date ,
	last_modification_date,
	last_modified_by
	) VALUES
	( 
	in_supplier_id ,
	in_retailer_id ,
	in_rating  	  ,
	NULL,
	in_review_comment,
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	in_last_modified_by
	) RETURNING CAST(review_id AS BIGINT) INTO out_review_id;

EXCEPTION WHEN OTHERS THEN 

	out_review_id := -1;	
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

