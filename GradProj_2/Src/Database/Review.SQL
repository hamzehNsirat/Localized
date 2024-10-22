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

