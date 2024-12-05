
-- TABLE: Purchase
-- TYPE: Main

CREATE TABLE purchase ( 
	purchase_id SERIAL PRIMARY KEY,
	quotation_id 		 BIGINT NOT NULL,
	buyer_id 		     BIGINT NOT NULL,
	supplier_id 		 BIGINT NOT NULL,
	purchase_status_id 	 BIGINT,
	purchase_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	payment_reference	  	  VARCHAR(32)  NOT NULL UNIQUE,
	reconciliation_reference  	VARCHAR(32)  UNIQUE,
	external_pay_reference  	VARCHAR(32)  UNIQUE,
	payment_amount		  	  FLOAT    NOT NULL,
	payment_currency	  	  CHAR(3)  NOT NULL DEFAULT 'JOD',
	payment_exchange_rate	  FLOAT    NOT NULL DEFAULT 1,
	last_modification_date  TIMESTAMP  NOT NULL,
	last_modified_by		BIGINT     NOT NULL,
	payment_method  	VARCHAR(30)  DEFAULT NULL,
	credit_cardholder  	VARCHAR(70)  DEFAULT NULL,
	credit_card_number  VARCHAR(120)  DEFAULT NULL,
	credit_card_expiry  DATE  DEFAULT NULL,
	credit_cvc CHAR(3) DEFAULT NULL,
	supplier_iban  	VARCHAR(34)  DEFAULT NULL,
	supplier_bank_account_num  	VARCHAR(18)  DEFAULT NULL,
	supplier_bank_name  VARCHAR(140)  DEFAULT NULL,

	CONSTRAINT fk_prchs_supplier_id FOREIGN KEY (supplier_id)
    REFERENCES supplier(supplier_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_prchs_retailer_id FOREIGN KEY (buyer_id)
    REFERENCES retailer(retailer_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_prchs_quotation_id FOREIGN KEY (quotation_id)
    REFERENCES quotation(quotation_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_prchs_status_id FOREIGN KEY (purchase_status_id)
    REFERENCES purchase_status(purchase_status_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_prchs_amount   CHECK(payment_amount >= 0),
	CONSTRAINT chk_prchs_exchng 	  CHECK(payment_exchange_rate >= 0)
);
/*
Purchase Indexes  / Triggers
*/

-- Quotation ID Index
-- to optimize the Retrieval Based on a given Purchase's Quotation ID
CREATE INDEX  idx_purchase_quotation ON purchase(quotation_id);

-- Supplier ID Index
-- to optimize the Retrieval Based on a given Purchase's Supplier ID
CREATE INDEX  idx_purchase_supplier ON purchase(supplier_id);

-- Retailer ID Index
-- to optimize the Retrieval Based on a given Purchase's Retailer ID
CREATE INDEX  idx_purchase_retailer ON purchase(buyer_id);


-- Review Rating Type Trigger
-- to decide type of Review (Positive: TRUE, Negative: FALSE)
CREATE OR REPLACE FUNCTION generate_payment_reference()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN			
	IF NEW.purchase_status_id = 1 THEN 
		NEW.payment_reference = (SELECT 'PST' || TO_CHAR(CURRENT_DATE,'YYMMDD') || (SELECT substr(concat(md5(random()::text), md5(random()::text)), 0, 20)));
	ELSEIF NEW.purchase_status_id = 4 THEN 
		NEW.reconciliation_reference = (SELECT 'REV' || TO_CHAR(CURRENT_DATE,'YYMMDD') || (SELECT substr(concat(md5(random()::text), md5(random()::text)), 0, 20)));
	END IF;
	RETURN NEW;
END;
$$

CREATE TRIGGER before_insert_payment_reference
BEFORE INSERT ON purchase
FOR EACH ROW
EXECUTE FUNCTION generate_payment_reference();

CREATE TRIGGER before_update_payment_reference
BEFORE UPDATE ON purchase
FOR EACH ROW
EXECUTE FUNCTION generate_payment_reference();


/*
 Purchase CRUD Functions
*/

-- GET A Purchase BY ID
CREATE OR REPLACE FUNCTION purchase_get_by_ids(IN in_purchase_id BIGINT, IN in_supplier_id BIGINT, IN in_buyer_id BIGINT, IN in_quotation_id BIGINT) 
RETURNS TABLE(
	out_purchase_id 			   BIGINT,
	out_quotation_id 	       	   BIGINT,
	out_buyer_id 		           BIGINT,
	out_supplier_id 		       BIGINT,
	out_purchase_status_id 	       BIGINT,
	out_purchase_date              TIMESTAMP,
	out_payment_reference	  	   VARCHAR,
	out_reconciliation_reference   VARCHAR,
	out_external_pay_reference     VARCHAR,
	out_payment_amount		  	   FLOAT,
	out_payment_currency	  	   CHAR,
	out_payment_exchange_rate	   FLOAT ,
	out_last_modification_date     TIMESTAMP,
	out_last_modified_by		   BIGINT,
	out_payment_method  	VARCHAR,
	out_credit_cardholder  	VARCHAR,
	out_credit_card_number  VARCHAR,
	out_credit_card_expiry  DATE,
	out_credit_cvc CHAR,
	out_supplier_iban  	VARCHAR,
	out_supplier_bank_account_num  	VARCHAR,
	out_supplier_bank_name  VARCHAR	
) 
AS $$ BEGIN
	IF in_purchase_id IS NOT NULL THEN 
		RETURN QUERY
		SELECT
		CAST(purchase_id AS BIGINT)			   ,
		quotation_id 	       	   ,
		buyer_id 		           ,
		supplier_id 		       ,
		purchase_status_id 	       ,
		purchase_date              ,
		payment_reference	  	   ,
		reconciliation_reference   ,
		external_pay_reference     ,
		payment_amount		  	   ,
		payment_currency	  	   ,
		payment_exchange_rate	   ,
		last_modification_date     ,
		last_modified_by		   ,
		payment_method  	,
		credit_cardholder  	,
		credit_card_number  ,
		credit_card_expiry  ,
		credit_cvc ,
		supplier_iban  	,
		supplier_bank_account_num  	,
		supplier_bank_name  	

		FROM	purchase
		WHERE	CAST(purchase_id AS BIGINT) = in_purchase_id;
	ELSIF in_quotation_id IS NOT NULL THEN 
		RETURN QUERY
		SELECT
		CAST(purchase_id AS BIGINT)			   ,
		quotation_id 	       	   ,
		buyer_id 		           ,
		supplier_id 		       ,
		purchase_status_id 	       ,
		purchase_date              ,
		payment_reference	  	   ,
		reconciliation_reference   ,
		external_pay_reference     ,
		payment_amount		  	   ,
		payment_currency	  	   ,
		payment_exchange_rate	   ,
		last_modification_date     ,
		last_modified_by		   ,
		payment_method  	,
		credit_cardholder  	,
		credit_card_number  ,
		credit_card_expiry  ,
		credit_cvc ,
		supplier_iban  	,
		supplier_bank_account_num  	,
		supplier_bank_name  	

		FROM	purchase
		WHERE	CAST(quotation_id AS BIGINT) = in_quotation_id;
	ELSIF in_buyer_id IS NOT NULL THEN 
		RETURN QUERY
		SELECT
		CAST(purchase_id AS BIGINT)			   ,
		quotation_id 	       	   ,
		buyer_id 		           ,
		supplier_id 		       ,
		purchase_status_id 	       ,
		purchase_date              ,
		payment_reference	  	   ,
		reconciliation_reference   ,
		external_pay_reference     ,
		payment_amount		  	   ,
		payment_currency	  	   ,
		payment_exchange_rate	   ,
		last_modification_date     ,
		last_modified_by,
		payment_method  	,
		credit_cardholder  	,
		credit_card_number  ,
		credit_card_expiry  ,
		credit_cvc ,
		supplier_iban  	,
		supplier_bank_account_num  	,
		supplier_bank_name  	

		FROM	purchase
		WHERE	CAST(buyer_id AS BIGINT) = in_buyer_id;
	ELSIF in_supplier_id IS NOT NULL THEN 
		RETURN QUERY
		SELECT
		CAST(purchase_id AS BIGINT)			   ,
		quotation_id 	       	   ,
		buyer_id 		           ,
		supplier_id 		       ,
		purchase_status_id 	       ,
		purchase_date              ,
		payment_reference	  	   ,
		reconciliation_reference   ,
		external_pay_reference     ,
		payment_amount		  	   ,
		payment_currency	  	   ,
		payment_exchange_rate	   ,
		last_modification_date     ,
		last_modified_by,
		payment_method  	,
		credit_cardholder  	,
		credit_card_number  ,
		credit_card_expiry  ,
		credit_cvc ,
		supplier_iban  	,
		supplier_bank_account_num  	,
		supplier_bank_name  	

		FROM	purchase
		WHERE	CAST(supplier_id AS BIGINT) = in_supplier_id;
	END IF;
END;
$$ LANGUAGE plpgsql;
-- INSERT A purchase
CREATE OR REPLACE FUNCTION purchase_insert (
	IN in_quotation_id 	       	   BIGINT,
	IN in_buyer_id 		           BIGINT,
	IN in_supplier_id 		       BIGINT,
	IN in_purchase_status_id 	       BIGINT,
	IN in_purchase_date              TIMESTAMP,
	IN in_payment_reference	  	   VARCHAR,
	IN in_reconciliation_reference   VARCHAR,
	IN in_external_pay_reference     VARCHAR,
	IN in_payment_amount		  	   FLOAT,
	IN in_payment_currency	  	   CHAR,
	IN in_payment_exchange_rate	   FLOAT ,
	IN in_last_modification_date     TIMESTAMP,
	IN in_last_modified_by		   BIGINT,
	IN in_payment_method  	VARCHAR,
	IN in_credit_cardholder  	VARCHAR,
	IN in_credit_card_number  VARCHAR,
	IN in_credit_card_expiry  DATE,
	IN in_credit_cvc CHAR,
	IN in_supplier_iban  	VARCHAR,
	IN in_supplier_bank_account_num  	VARCHAR,
	IN in_supplier_bank_name  	VARCHAR

	OUT out_purchase_id BIGINT
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
	purchase (
		quotation_id 	       	   ,
		buyer_id 		           ,
		supplier_id 		       ,
		purchase_status_id 	       ,
		purchase_date              ,
		payment_reference	  	   ,
		reconciliation_reference   ,
		external_pay_reference     ,
		payment_amount		  	   ,
		payment_currency	  	   ,
		payment_exchange_rate	   ,
		last_modification_date     ,
		last_modified_by,
		payment_method  	,
		credit_cardholder  	,
		credit_card_number  ,
		credit_card_expiry  ,
		credit_cvc ,
		supplier_iban  	,
		supplier_bank_account_num  	,
		supplier_bank_name  	
		   
		)
	VALUES
	(
		in_quotation_id 	       	   ,
		in_buyer_id 		           ,
		in_supplier_id 		       ,
		in_purchase_status_id 	       ,
		in_purchase_date              ,
		in_payment_reference	  	   ,
		in_reconciliation_reference   ,
		in_external_pay_reference     ,
		in_payment_amount		  	   ,
		in_payment_currency	  	   ,
		in_payment_exchange_rate	   ,
		CURRENT_TIMESTAMP     ,
		in_last_modified_by,
		in_payment_method  	,
		in_credit_cardholder  	,
		in_credit_card_number  ,
		in_credit_card_expiry  ,
		in_credit_cvc ,
		in_supplier_iban  	,
		in_supplier_bank_account_num  	,
		in_supplier_bank_name  	
	) RETURNING CAST(purchase_id AS BIGINT) INTO out_purchase_id;
EXCEPTION
WHEN OTHERS THEN 
	out_purchase_id := -1;
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


-- UPDATE A purchase
CREATE OR REPLACE FUNCTION purchase_update (
	IN in_purchase_id 			   BIGINT,
	IN in_quotation_id 	       	   BIGINT,
	IN in_buyer_id 		           BIGINT,
	IN in_supplier_id 		       BIGINT,
	IN in_purchase_status_id 	       BIGINT,
	IN in_purchase_date              TIMESTAMP,
	IN in_payment_reference	  	   VARCHAR,
	IN in_reconciliation_reference   VARCHAR,
	IN in_external_pay_reference     VARCHAR,
	IN in_payment_amount		  	   FLOAT,
	IN in_payment_currency	  	   CHAR,
	IN in_payment_exchange_rate	   FLOAT ,
	IN in_last_modification_date     TIMESTAMP,
	IN in_last_modified_by		   BIGINT,
	IN in_payment_method  	VARCHAR,
	IN in_credit_cardholder  	VARCHAR,
	IN in_credit_card_number  VARCHAR,
	IN in_credit_card_expiry  DATE,
	IN in_credit_cvc CHAR,
	IN in_supplier_iban  	VARCHAR,
	IN in_supplier_bank_account_num  	VARCHAR,
	IN in_supplier_bank_name  	VARCHAR

	OUT update_res INT
) 
RETURNS INT 
AS $$ 
DECLARE
v_state TEXT;
v_msg TEXT;
v_detail TEXT;
v_hint TEXT;
v_context TEXT;
BEGIN
	UPDATE	purchase 
	SET
	quotation_id = COALESCE(in_quotation_id, quotation_id) ,
	buyer_id = COALESCE(in_buyer_id, buyer_id) ,
	supplier_id = COALESCE(in_supplier_id, supplier_id),
	purchase_status_id = COALESCE(in_purchase_status_id, purchase_status_id) ,
	purchase_date = COALESCE(in_purchase_date, purchase_date) ,
	payment_reference = COALESCE(in_payment_reference, payment_reference) ,
	reconciliation_reference = COALESCE(in_reconciliation_reference, reconciliation_reference) ,
	external_pay_reference = COALESCE(in_external_pay_reference, external_pay_reference),
	payment_amount = COALESCE(in_payment_amount, payment_amount) ,
	payment_currency = COALESCE(in_payment_currency, payment_currency),
	payment_exchange_rate = COALESCE(in_payment_exchange_rate, payment_exchange_rate),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by = COALESCE(in_last_modified_by, last_modified_by),
	payment_method = COALESCE(in_payment_method,payment_method)  	,
	credit_cardholder = COALESCE(in_credit_cardholder,credit_cardholder)  	,
	credit_card_number = COALESCE(in_credit_card_number,credit_card_number)  ,
	credit_card_expiry = COALESCE(in_credit_card_expiry,credit_card_expiry)  ,
	credit_cvc = COALESCE(in_credit_cvc,credit_cvc) ,
	supplier_iban = COALESCE(in_supplier_iban,supplier_iban)  	,
	supplier_bank_account_num = COALESCE(in_supplier_bank_account_num,supplier_bank_account_num)  	,
	supplier_bank_name  = COALESCE(in_supplier_bank_name,supplier_bank_name) 	

	WHERE
	CAST(purchase_id AS BIGINT) = in_purchase_id;
	update_res := 0;

EXCEPTION WHEN OTHERS THEN 

	update_res := -1;
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

CREATE OR REPLACE FUNCTION purchase_delete (IN in_purchase_id BIGINT, OUT update_res INT) 
RETURNS INT 
AS $$ BEGIN
	UPDATE	purchase SET
	purchase_status_id = (
		SELECT
			purchase_status_id
		FROM
			purchase_status P
		WHERE
			P.purchase_status LIKE '%EXPIRED%'
	)
	WHERE
	CAST(purchase_id AS BIGINT) = in_purchase_id;
	SET	update_res = 0;
EXCEPTION
WHEN OTHERS THEN 
	update_res := -1;
END;
$$ LANGUAGE plpgsql;
