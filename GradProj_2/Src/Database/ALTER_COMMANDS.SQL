-- LAST UPDATED: 27-11-2024
-- REMOVE MIDDLE NAME NOT NULL CONSTRAINT IN TABLE: USER_LOCALIZED
ALTER TABLE user_localized ALTER COLUMN middle_name DROP NOT NULL
ALTER TABLE user_localized ALTER COLUMN user_phone_number DROP NOT NULL
ALTER TABLE user_localized ALTER COLUMN date_of_birth DROP NOT NULL
ALTER TABLE user_localized DROP COLUMN user_pass_salt
ALTER TABLE user_localized ALTER COLUMN date_of_birth SET DEFAULT '1970-01-01';
ALTER TABLE user_localized ALTER COLUMN middle_name SET DEFAULT '';
ALTER TABLE user_localized ALTER COLUMN user_phone_number SET DEFAULT NULL;
----------------------------------
DROP TRIGGER before_update_userpass ON user_localized;
CREATE TRIGGER before_update_userpass 
BEFORE UPDATE ON user_localized
FOR EACH ROW
WHEN ( 
    NEW.is_pass_change IS NOT NULL AND NEW.is_pass_change = TRUE
)
EXECUTE FUNCTION insert_salt_user_password();
----------------------------------
ALTER TABLE supplier ALTER COLUMN supplier_tax_identification_num DROP NOT NULL;
ALTER TABLE supplier ALTER COLUMN supplier_iban DROP NOT NULL;
ALTER TABLE supplier ALTER COLUMN supplier_tax_identification_num SET DEFAULT NULL;
ALTER TABLE supplier ALTER COLUMN supplier_iban SET DEFAULT NULL;
ALTER TABLE supplier ALTER COLUMN supplier_bank_account_num SET DEFAULT NULL;

ALTER TABLE retailer ALTER COLUMN retailer_tax_identification_num DROP NOT NULL;
ALTER TABLE retailer ALTER COLUMN retailer_iban DROP NOT NULL;
ALTER TABLE retailer ALTER COLUMN retailer_tax_identification_num SET DEFAULT NULL;
ALTER TABLE retailer ALTER COLUMN retailer_iban SET DEFAULT NULL;
ALTER TABLE retailer ALTER COLUMN retailer_bank_account_num SET DEFAULT NULL;

ALTER TABLE establishment ALTER COLUMN establishment_registration_date DROP NOT NULL;
ALTER TABLE establishment ALTER COLUMN commercial_registration_num DROP NOT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_email DROP NOT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_city DROP NOT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_registration_date SET DEFAULT NULL;
ALTER TABLE establishment ALTER COLUMN commercial_registration_num SET DEFAULT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_email SET DEFAULT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_city SET DEFAULT NULL;
----------------------------------------------------------------------------------------
drop function user_insert;
drop function user_update;
-- INSERT A User
CREATE OR REPLACE FUNCTION user_insert (
	IN in_national_number   BIGINT,
	IN in_user_type    BIGINT,
	IN in_user_status  BIGINT,
	IN in_first_name   VARCHAR,
	IN in_middle_name 	VARCHAR,
	IN in_last_name	VARCHAR,
	IN in_date_of_birth  DATE,
	IN in_user_name 	  VARCHAR,
	IN in_user_address 	TEXT ,
	IN in_user_email 	  VARCHAR,
	IN in_user_password  VARCHAR,
	IN in_is_email_verified BOOLEAN,
	IN in_user_phone_number VARCHAR,
	IN in_last_modified_by	 BIGINT,
	IN in_image BYTEA,
	OUT out_user_id BIGINT
)
RETURNS BIGINT AS $$
BEGIN
    INSERT INTO user_localized 
	(	
	national_number,
	user_type,
	user_status,
	first_name,
	middle_name,
	last_name,
	date_of_birth,
	user_name_lclzd 	 ,
	user_address ,
	user_email 	 ,
	user_password,
	is_email_verified,
	user_phone_number,
	last_modification_date,
	last_modified_by,
	user_image
	)
	VALUES
	(
	in_national_number,
	in_user_type,
	in_user_status,
	in_first_name,
	in_middle_name,
	in_last_name,
	in_date_of_birth,
	in_user_name,
	in_user_address ,
	in_user_email ,
	in_user_password,
	in_is_email_verified,
	in_user_phone_number,
	CURRENT_TIMESTAMP,
	in_last_modified_by,
	in_image
	) RETURNING CAST(user_id AS BIGINT) INTO out_user_id;

EXCEPTION WHEN OTHERS THEN 
	out_user_id := -1;	
END;
$$ LANGUAGE plpgsql;

-- UPDATE A User
CREATE OR REPLACE FUNCTION user_update (
	IN in_national_number   BIGINT,
	IN in_user_type    BIGINT,
	IN in_user_status  BIGINT,
	IN in_first_name   VARCHAR,
	IN in_middle_name 	VARCHAR,
	IN in_last_name	VARCHAR,
	IN in_date_of_birth  DATE,
	IN in_user_name 	  VARCHAR,
	IN in_user_address 	TEXT ,
	IN in_user_email 	  VARCHAR,
	IN in_user_password  VARCHAR,
	IN in_is_email_verified BOOLEAN,
	IN in_user_phone_number VARCHAR,
	IN in_last_modified_by	 BIGINT,
	IN in_user_image BYTEA,
	IN in_user_id BIGINT,
	IN in_is_pass_change BOOLEAN,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
    UPDATE user_localized 
	SET	
	national_number=	COALESCE(in_national_number, national_number),
	user_status=	COALESCE(in_user_status, user_status),
	first_name=	COALESCE(in_first_name, first_name),
	middle_name=	COALESCE(in_middle_name, middle_name),
	last_name=	COALESCE(in_last_name, last_name),
	date_of_birth=	COALESCE(in_date_of_birth, date_of_birth),
	user_address =	COALESCE(in_user_address, user_address) ,
	user_email 	 =	COALESCE(in_user_email, user_email) ,
	user_password =	COALESCE(in_user_password, user_password),
	is_email_verified =  	COALESCE(in_is_email_verified, is_email_verified),

	user_phone_number = 	COALESCE(in_user_phone_number, user_phone_number),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by),
	user_image = COALESCE(in_user_image, user_image),
	is_pass_change = COALESCE(in_is_pass_change, is_pass_change)
	WHERE CAST(user_id AS BIGINT) = in_user_id;
	update_res := 0;	

EXCEPTION WHEN OTHERS THEN 
	update_res := -1;	

END;
$$ LANGUAGE plpgsql;
------------------------------------------------------------------------------------
-- UPDATE A UserStatus By Admin
CREATE OR REPLACE FUNCTION user_update_status (
	IN in_user_status  BIGINT,
	IN in_user_id BIGINT,
	IN in_last_modified_by BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
    UPDATE user_localized 
	SET	
	user_status		=	COALESCE(in_user_status, user_status),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by)
	WHERE CAST(user_id AS BIGINT) = in_user_id;
	update_res := 0;	

EXCEPTION WHEN OTHERS THEN 
	update_res := -1;	

END;
$$ LANGUAGE plpgsql;
------------------------------------------------------------------------------------
-- PLUS APPLICATION.SQL FILE
-- VALIDATE USER LOGIN
DROP FUNCTION validate_user_login;
CREATE OR REPLACE FUNCTION validate_user_login (
		IN in_user_name 		VARCHAR,
		IN in_user_email 		VARCHAR,
		IN in_user_pass 		VARCHAR
)
RETURNS TABLE(		
		out_user_id		 BIGINT,
		out_user_type    BIGINT,
		out_is_valid    INTEGER
) AS $$
DECLARE salted_pass VARCHAR; 
DECLARE v_user_id BIGINT;
DECLARE v_user_type BIGINT;
DECLARE v_user_name VARCHAR;
DECLARE v_user_email VARCHAR;
DECLARE check_state BOOLEAN;
BEGIN

	SELECT user_password, user_id, user_type
	FROM user_localized D
	WHERE (CAST(D.user_name_lclzd AS VARCHAR) = in_user_name  OR CAST(D.user_email AS VARCHAR) = in_user_email)  INTO salted_pass, v_user_id, v_user_type;
	IF salted_pass IS NULL THEN 
		v_user_id := 0;
		v_user_type := 0;
		RETURN QUERY SELECT  v_user_id,v_user_type, 0;
	END IF;
	check_state = (SELECT  (salted_pass = crypt(in_user_pass, salted_pass)));
	IF check_state = TRUE THEN 
		RETURN QUERY SELECT v_user_id,v_user_type, 1;
	ELSE 
		RETURN QUERY  SELECT v_user_id,v_user_type, 0;
	END IF;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------
ALTER TABLE user_localized
ADD COLUMN reset_password_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_password_expires TIMESTAMP DEFAULT NULL;
-----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION insert_salt_user_password()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	NEW.user_password = (SELECT crypt(NEW.user_password, gen_salt('md5'))) ;
	NEW.is_pass_change = FALSE;
	RETURN NEW;
END;
$$

------------------------------------------------
-- 02-12-2024
alter table retailstore drop constraint fk_retailstore_owner_id;
alter table retailstore add constraint fk_retailstore_owner_id foreign key (owner_id)
references retailer(retailer_id);
------------------------------------------------
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
------------------------------------------------
-- 05-12-2024
ALTER TABLE quotation DROP COLUMN payment_details_bank;
ALTER TABLE quotation DROP COLUMN payment_details_iban;
ALTER TABLE quotation DROP COLUMN payment_details_bank_acc_num;
ALTER TABLE quotation ADD COLUMN shipping_cost FLOAT DEFAULT NULL;
ALTER TABLE quotation ADD COLUMN sub_total FLOAT DEFAULT NULL;
ALTER TABLE quotation ADD COLUMN total FLOAT DEFAULT NULL;
-- GET A Quotation ALL DATA
DROP FUNCTION quotation_get_all_data;
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
DROP FUNCTION quotation_get_by_supplier;
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
DROP FUNCTION quotation_get_by_retailer;
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

-- INSERT A Quotation
DROP FUNCTION quotation_insert;
CREATE OR REPLACE FUNCTION quotation_insert (
	IN in_requester_id 		 BIGINT , -- from inp
	IN in_supplier_id 		 BIGINT , -- from inp
	IN in_quotation_status_id  BIGINT , -- 1 
	IN in_quotation_request_date   TIMESTAMP, -- from inp
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
	payment_details_bank		      ,
	payment_details_iban		     ,
	payment_details_bank_acc_num	,
	from_establishment_name	  ,
	to_establishment_name	  ,
	ship_to_address		      ,
	bill_to_address		      ,
	supplier_address		  ,
	last_updater_type		,
	last_modification_date  ,
	last_modified_by,		
	shipping_cost	,
	sub_total		,
	total			

		)
	VALUES
		(
		in_requester_id 		  ,
		in_supplier_id 		  ,
		in_quotation_status_id   ,
		in_quotation_request_date   ,
		in_quotation_details     ,
		in_quotation_attachments ,
		in_payment_details_bank		      ,
		in_payment_details_iban		      ,
		in_payment_details_bank_acc_num	  ,
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
DROP FUNCTION quotation_update_details;
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
-------------------------------------------------
ALTER TABLE order_localized DROP COLUMN order_quantity_unit;
ALTER TABLE order_localized ADD COLUMN order_price FLOAT DEFAULT NULL;
DROP FUNCTION order_get_by_Id;
CREATE OR REPLACE FUNCTION order_get_by_Id(IN in_order_id BIGINT) 
RETURNS TABLE(
	out_order_id 			 BIGINT,
	out_quotation_id 		 BIGINT,
	out_product_id  		 BIGINT,
	out_order_quantity   	 FLOAT,
	out_order_price  FLOAT,
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
	order_price,
	order_date,
	last_modification_date,
	last_modified_by
	FROM	order_localized
	WHERE	CAST(order_id AS BIGINT) = in_order_id;
END;
$$ LANGUAGE plpgsql;
-- GET AN Order BY Quotation
DROP FUNCTION order_get_by_quotation;
CREATE OR REPLACE FUNCTION order_get_by_quotation(IN in_quotation_id BIGINT) 
RETURNS TABLE(
	out_order_id 			 BIGINT,
	out_product_id  		 BIGINT,
	out_order_quantity   	 FLOAT,
	out_order_price  FLOAT,
	out_order_date			    TIMESTAMP,
	out_last_modification_date  TIMESTAMP,
	out_last_modified_by  		BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(order_id AS BIGINT),
	product_id,
	order_quantity,
	order_price,
	order_date,
	last_modification_date,
	last_modified_by
	FROM	order_localized
	WHERE	CAST(quotation_id AS BIGINT) = in_quotation_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT AN Order
DROP FUNCTION order_insert;
CREATE OR REPLACE FUNCTION order_insert (
	IN in_quotation_id 		 BIGINT,
	IN in_product_id  		 BIGINT,
	IN in_order_quantity   	 FLOAT,
	IN in_order_price  FLOAT,
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
			last_modified_by ,
			order_price 
		)
	VALUES
		(
			in_quotation_id,
			in_product_id,
			in_order_quantity,
			in_order_quantity_unit,
			in_order_date,
			CURRENT_TIMESTAMP,
			in_last_modified_by,
			in_order_price
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
-------------------------------------------------
ALTER TABLE purchase ADD COLUMN	payment_method  	VARCHAR(30)  DEFAULT NULL;
ALTER TABLE purchase ADD COLUMN	credit_cardholder  	VARCHAR(70)  DEFAULT NULL;
ALTER TABLE purchase ADD COLUMN	credit_card_number  VARCHAR(120)  DEFAULT NULL;
ALTER TABLE purchase ADD COLUMN	credit_card_expiry  DATE  DEFAULT NULL;
ALTER TABLE purchase ADD COLUMN	credit_cvc CHAR(3) DEFAULT NULL;
ALTER TABLE purchase ADD COLUMN	supplier_iban  	VARCHAR(34)  DEFAULT NULL;
ALTER TABLE purchase ADD COLUMN	supplier_bank_account_num  	VARCHAR(18)  DEFAULT NULL;
ALTER TABLE purchase ADD COLUMN	supplier_bank_name  VARCHAR(140)  DEFAULT NULL;
-- GET A Purchase BY ID
DROP FUNCTION purchase_get_by_ids;
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
DROP FUNCTION purchase_insert;
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
	IN in_supplier_bank_name  	VARCHAR,

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
DROP FUNCTION purchase_update;
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
	IN in_supplier_bank_name  	VARCHAR,

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
----------------------------------------------------------------------------