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
ALTER TABLE user_localized ALTER COLUMN user_image TYPE TEXT;
ALTER TABLE product ALTER COLUMN product_image TYPE TEXT;
ALTER TABLE establishment ALTER COLUMN establishment_cover TYPE TEXT;
ALTER TABLE establishment ALTER COLUMN establishment_logo TYPE TEXT;
ALTER TABLE application ALTER COLUMN establishment_logo TYPE TEXT;
----------------------------------------------------------------------------
DROP FUNCTION user_get_by_id
CREATE OR REPLACE FUNCTION user_get_by_id(IN in_user_id BIGINT)
RETURNS TABLE(		
		national_number BIGINT,
		user_type    	BIGINT,
		user_status  	BIGINT,
		first_name 		VARCHAR,
		middle_name 	VARCHAR,
		last_name 		VARCHAR,
		date_of_birth  	DATE,
		user_name 		VARCHAR,
		user_address 	TEXT,
		user_email 		VARCHAR,
		is_email_verified BOOLEAN,
		user_phone_number VARCHAR,
		user_image TEXT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
		D.national_number,
		D.user_type,
		D.user_status,
		D.first_name,
		D.middle_name,
		D.last_name,
		D.date_of_birth,
		D.user_name_lclzd,
		D.user_address,
		D.user_email,
		D.is_email_verified,
		D.user_phone_number,
		D.user_image
	FROM user_localized AS D
	WHERE CAST(D.user_id AS BIGINT) = in_user_id;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION user_get_list
CREATE OR REPLACE FUNCTION user_get_list(IN in_page_size INT, in_page_index INT)
RETURNS TABLE (		
		user_id BIGINT,
		national_number BIGINT,
		user_type    	BIGINT,
		user_status  	BIGINT,
		first_name 		VARCHAR,
		middle_name 	VARCHAR,
		last_name 		VARCHAR,
		date_of_birth  	DATE,
		user_name 		VARCHAR,
		user_address 	TEXT,
		user_email 		VARCHAR,
		is_email_verified BOOLEAN,
		user_phone_number VARCHAR,
    user_image TEXT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
		CAST(D.user_id AS BIGINT),
		D.national_number,
		D.user_type,
		D.user_status,
		D.first_name,
		D.middle_name,
		D.last_name,
		D.date_of_birth,
		D.user_name_lclzd,
		D.user_address,
		D.user_email,
		D.is_email_verified,
		D.user_phone_number,
    D.user_image
	FROM user_localized AS D
	ORDER BY user_id ASC
	LIMIT in_page_size
	OFFSET ((in_page_index - 1) * in_page_size) ;
END;
$$ LANGUAGE plpgsql;
------------------------------------------------------------------ 
-- GET ALL APPLICATIONS
DROP FUNCTION application_get_all;
CREATE OR REPLACE FUNCTION application_get_all(IN page_size INTEGER, IN page_index INTEGER)
RETURNS TABLE(	
		out_application_id BIGINT,
		out_establishment_name TEXT,
		out_establishment_logo       TEXT,
		out_application_status    VARCHAR
) 
AS $$
BEGIN
    RETURN QUERY 
	SELECT 
		CAST(application_id AS BIGINT),
		establishment_name,
		establishment_logo,
		application_status
	FROM application
    ORDER BY application_id DESC
	LIMIT page_size
	OFFSET ((page_index - 1) * page_size) ;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION application_get_by_id;

-- GET APPLICATION DATA
CREATE OR REPLACE FUNCTION application_get_by_id(IN in_application_id BIGINT)
RETURNS TABLE(	
        out_application_id BIGINT,
        out_user_first_name VARCHAR,
        out_user_last_name VARCHAR,
        out_user_name VARCHAR,
        out_user_email VARCHAR,
        out_user_password  VARCHAR,
        out_user_phone_number VARCHAR,
        out_establishment_name TEXT,
        out_establishment_contact_number VARCHAR,
        out_establishment_email VARCHAR,
        out_establishment_description TEXT,
        out_establishment_commercial_registration_num BIGINT,
        out_establishment_city VARCHAR,
        out_establishment_street VARCHAR,
        out_establishment_building_num VARCHAR,
        out_establishment_industry_type_spec    BIGINT[],
        out_establishment_logo       TEXT,
        out_user_type INT
) 
AS $$
BEGIN
    RETURN QUERY 
	SELECT 
		CAST(application_id AS BIGINT),
        user_first_name ,
        user_last_name ,
        user_name ,
        user_email ,
        user_password  ,
        user_phone_number ,
        establishment_name ,
        establishment_contact_number ,
        establishment_email ,
        establishment_description ,
        establishment_commercial_registration_num ,
        establishment_city ,
        establishment_street ,
        establishment_building_num ,
        establishment_industry_type_spec    ,
        establishment_logo,
        user_type       
	FROM application
    WHERE CAST(application_id AS BIGINT) = in_application_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT APPLICATION
DROP FUNCTION application_insert;

CREATE OR REPLACE FUNCTION application_insert(
        IN in_user_first_name VARCHAR,
        IN in_user_last_name VARCHAR,
        IN in_user_name VARCHAR,
        IN in_user_email VARCHAR,
        IN in_user_password  VARCHAR,
        IN in_user_phone_number VARCHAR,
        IN in_establishment_name TEXT,
        IN in_establishment_contact_number VARCHAR,
        IN in_establishment_email VARCHAR,
        IN in_establishment_description TEXT,
        IN in_establishment_commercial_registration_num BIGINT,
        IN in_establishment_city VARCHAR,
        IN in_establishment_street VARCHAR,
        IN in_establishment_building_num VARCHAR,
        IN in_establishment_industry_type_spec    BIGINT[],
        IN in_establishment_logo       TEXT,
        IN in_user_type INTEGER,
        OUT out_application_id BIGINT
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
   INSERT INTO application
	(   
        application_status,
        user_first_name ,
        user_last_name ,
        user_name ,
        user_email ,
        user_password  ,
        user_phone_number ,
        establishment_name ,
        establishment_contact_number ,
        establishment_email ,
        establishment_description ,
        establishment_commercial_registration_num ,
        establishment_city ,
        establishment_street ,
        establishment_building_num ,
        establishment_industry_type_spec    ,
        establishment_logo,       
        creation_date  ,
        last_modification_date,
        last_modified_by,
        user_type
    )
    VALUES (
        'NEW',
        in_user_first_name ,
        in_user_last_name ,
        in_user_name ,
        in_user_email ,
        in_user_password  ,
        in_user_phone_number ,
        in_establishment_name ,
        in_establishment_contact_number ,
        in_establishment_email ,
        in_establishment_description ,
        in_establishment_commercial_registration_num ,
        in_establishment_city ,
        in_establishment_street ,
        in_establishment_building_num ,
        in_establishment_industry_type_spec    ,
        in_establishment_logo,       
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        1,
        in_user_type
    ) RETURNING CAST(application_id AS BIGINT) INTO out_application_id;
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
	out_application_id:= -1;
END;
$$ LANGUAGE plpgsql;
---------------------------------------------------------------
/*
Establishment CRUD Functions
*/
-- GET ALL ESTABLISHMENTS
DROP FUNCTION establishment_get_all;

CREATE OR REPLACE FUNCTION establishment_get_all()
RETURNS TABLE(	
		out_establishment_id BIGINT,
		out_establishment_status    BIGINT,
		out_industry_type    BIGINT[],
		out_establishment_name TEXT,
		out_commercial_registration_num BIGINT,
		out_establishment_registration_date TIMESTAMP,
		out_contact_number VARCHAR,
		out_establishment_email VARCHAR,
		out_establishment_website TEXT,
		out_establishment_description TEXT,
		out_establishment_type BOOLEAN,
		out_establishment_city VARCHAR,
		out_establishment_street VARCHAR,
		out_establishment_building_num VARCHAR,
		out_establishment_logo       TEXT,
		out_establishment_cover       TEXT,
		out_est_compliance_indicator FLOAT,
		out_est_compliance_indicator_desc VARCHAR,
		out_last_modification_date  TIMESTAMP,
		out_last_modified_by		 BIGINT
	) 
AS $$
BEGIN
    RETURN QUERY 
	SELECT 
		CAST(establishment_id AS BIGINT),
		establishment_status,
		industry_type_spec,
		establishment_name,
		commercial_registration_num,
		establishment_registration_date,
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		establishment_logo,
		establishment_cover,
		est_compliance_indicator,
		est_compliance_indicator_desc,
		last_modification_date,
		last_modified_by	
	FROM establishment;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION establishment_get_by_id;

-- GET AN ESTABLISHMENT BY ID
CREATE OR REPLACE FUNCTION establishment_get_by_id(IN est_id BIGINT)
RETURNS TABLE(		
		out_establishment_status BIGINT,
		out_industry_type    BIGINT[],
		out_establishment_name TEXT,
		out_commercial_registration_num BIGINT,
		out_establishment_registration_date TIMESTAMP,
		out_contact_number VARCHAR,
		out_establishment_email VARCHAR,
		out_establishment_website TEXT,
		out_establishment_description TEXT,
		out_establishment_type BOOLEAN,
		out_establishment_city VARCHAR,
		out_establishment_street VARCHAR,
		out_establishment_building_num VARCHAR,
		out_establishment_logo       TEXT,
		out_establishment_cover       TEXT,
		out_est_compliance_indicator FLOAT,
		out_est_compliance_indicator_desc VARCHAR,
		out_last_modification_date  TIMESTAMP,
		out_last_modified_by		 BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
		establishment_status,
		industry_type_spec,
		establishment_name,
		commercial_registration_num,
		establishment_registration_date,
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		establishment_logo,
		establishment_cover,
		est_compliance_indicator,
		est_compliance_indicator_desc,
		last_modification_date,
		last_modified_by	
	FROM establishment
	WHERE CAST(establishment_id AS BIGINT) = est_id;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION establishment_get_by_commercial_reg_num;

-- GET AN ESTABLISHMENT BY COMMERCIAL REG NUMBER
CREATE OR REPLACE FUNCTION establishment_get_by_commercial_reg_num(IN est_cmr_reg_num BIGINT)
RETURNS TABLE(		
		out_establishment_id BIGINT,
		out_establishment_status BIGINT,
		out_industry_type    BIGINT[],
		out_establishment_name TEXT,
		out_commercial_registration_num BIGINT,
		out_establishment_registration_date TIMESTAMP,
		out_contact_number VARCHAR,
		out_establishment_email VARCHAR,
		out_establishment_website TEXT,
		out_establishment_description TEXT,
		out_establishment_type BOOLEAN,
		out_establishment_city VARCHAR,
		out_establishment_street VARCHAR,
		out_establishment_building_num VARCHAR,
		out_establishment_logo       TEXT,
		out_establishment_cover       TEXT,
		out_est_compliance_indicator FLOAT,
		out_est_compliance_indicator_desc VARCHAR,
		out_last_modification_date  TIMESTAMP,
		out_last_modified_by		 BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
		CAST(establishment_id AS BIGINT),
		establishment_status,
		industry_type_spec,
		establishment_name,
		commercial_registration_num,
		CAST(establishment_registration_date AS TIMESTAMP),
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		establishment_logo,
		establishment_cover,
		est_compliance_indicator,
		est_compliance_indicator_desc,
		last_modification_date,
		last_modified_by	
	FROM establishment
	WHERE CAST(commercial_registration_num AS BIGINT) = est_cmr_reg_num;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION establishment_get_by_industry_type;

-- GET AN ESTABLISHMENT BY INDUSTRY TYPE/S
CREATE OR REPLACE FUNCTION establishment_get_by_industry_type(IN est_industry_type BIGINT[])
RETURNS TABLE(		
		out_establishment_id BIGINT,
		out_establishment_status BIGINT,
		out_industry_type    BIGINT[],
		out_establishment_name TEXT,
		out_commercial_registration_num BIGINT,
		out_establishment_registration_date TIMESTAMP,
		out_contact_number VARCHAR,
		out_establishment_email VARCHAR,
		out_establishment_website TEXT,
		out_establishment_description TEXT,
		out_establishment_type BOOLEAN,
		out_establishment_city VARCHAR,
		out_establishment_street VARCHAR,
		out_establishment_building_num VARCHAR,
		out_establishment_logo       TEXT,
		out_establishment_cover       TEXT,		
		out_est_compliance_indicator FLOAT,
		out_est_compliance_indicator_desc VARCHAR,
		out_last_modification_date  TIMESTAMP,
		out_last_modified_by		 BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
		CAST(establishment_id AS BIGINT),
		establishment_status,
		industry_type_spec,
		establishment_name,
		commercial_registration_num,
		CAST(establishment_registration_date AS TIMESTAMP),
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		establishment_logo,
		establishment_cover,
		est_compliance_indicator,
		est_compliance_indicator_desc,
		last_modification_date,
		last_modified_by	
	FROM establishment
	WHERE industry_type_spec = est_industry_type;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION establishment_insert;

-- INSERT AN Establishment
CREATE OR REPLACE FUNCTION establishment_insert(
	IN in_establishment_status    BIGINT,
	IN in_industry_type    BIGINT[],
	IN in_establishment_name TEXT,
	IN in_commercial_registration_num BIGINT,
	IN in_establishment_registration_date TIMESTAMP,
	IN in_contact_number VARCHAR,
	IN in_establishment_email VARCHAR,
	IN in_establishment_website TEXT,
	IN in_establishment_description TEXT,
	IN in_establishment_type BOOLEAN,
	IN in_establishment_city VARCHAR,
	IN in_establishment_street VARCHAR,
	IN in_establishment_building_num VARCHAR,
	IN in_establishment_logo       TEXT,
	IN in_establishment_cover       TEXT,
	IN in_est_compliance_indicator FLOAT,
	IN in_est_compliance_indicator_desc VARCHAR,
	IN last_modifier BIGINT,
	OUT out_establishment_id BIGINT
)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
INSERT INTO establishment (
		establishment_status,
		establishment_name,
		commercial_registration_num,
		establishment_registration_date,
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		industry_type_spec,
		establishment_logo      ,
		establishment_cover      ,
		est_compliance_indicator,
		est_compliance_indicator_desc,
		last_modification_date,
		last_modified_by
	) VALUES
	(
		in_establishment_status,
		in_establishment_name,
		in_commercial_registration_num,
		in_establishment_registration_date,
		in_contact_number,
		in_establishment_email,
		in_establishment_website,
		in_establishment_description,
		in_establishment_type,
		in_establishment_city,
		in_establishment_street,
		in_establishment_building_num,
		in_industry_type,
		in_establishment_logo,
		in_establishment_cover,
		in_est_compliance_indicator,
		in_est_compliance_indicator_desc,
		last_modifier
	) RETURNING CAST(establishment_id AS BIGINT) INTO out_establishment_id;		
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
	out_establishment_id:= -1;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION establishment_update;

-- UPDATE AN ESTABLISHMENT 
CREATE OR REPLACE FUNCTION establishment_update (
	IN est_id BIGINT,
	IN in_establishment_status    BIGINT,
	IN in_industry_type    BIGINT[],
	IN in_establishment_name TEXT,
	IN in_commercial_registration_num BIGINT,
	IN in_establishment_registration_date TIMESTAMP,
	IN in_contact_number VARCHAR,
	IN in_establishment_email VARCHAR,
	IN in_establishment_website TEXT,
	IN in_establishment_description TEXT,
	IN in_establishment_city VARCHAR,
	IN in_establishment_street VARCHAR,
	IN in_establishment_building_num VARCHAR,
	IN in_establishment_logo       TEXT,
	IN in_establishment_cover       TEXT,
	IN in_est_compliance_indicator FLOAT,
	IN in_est_compliance_indicator_desc VARCHAR,
	IN last_modifier BIGINT
)
RETURNS INTEGER AS $$
BEGIN
	UPDATE establishment 
	SET 
	establishment_status = COALESCE(in_establishment_status, establishment_status),
	industry_type_spec = COALESCE(in_industry_type, industry_type_spec),
	establishment_name = COALESCE(in_establishment_name, establishment_name),
	commercial_registration_num = COALESCE(in_commercial_registration_num, commercial_registration_num),
	establishment_registration_date = COALESCE(in_establishment_registration_date, establishment_registration_date),
	contact_number = COALESCE(in_contact_number, contact_number),
	establishment_email = COALESCE(in_establishment_email, establishment_email),
	establishment_website = COALESCE(in_establishment_website, establishment_website),
	establishment_description = COALESCE(in_establishment_description, establishment_description),
	establishment_city = COALESCE(in_establishment_city, establishment_city),
	establishment_street = COALESCE(in_establishment_street, establishment_street),
	establishment_building_num = COALESCE(in_establishment_building_num, establishment_building_num),
	establishment_logo   = COALESCE(in_establishment_logo, establishment_logo),
	establishment_cover  = COALESCE(in_establishment_cover, establishment_cover),
	est_compliance_indicator = COALESCE(in_est_compliance_indicator, est_compliance_indicator),
	est_compliance_indicator_desc = COALESCE(in_est_compliance_indicator_desc, est_compliance_indicator_desc),
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	COALESCE(last_modifier, last_modified_by)

	WHERE CAST(establishment_id AS BIGINT) = est_id;
	RETURN 0 AS execution_result;

EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
---------------------------------------------------------------
-- INSERT A User
DROP FUNCTION user_insert;
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
	IN in_image TEXT,
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
DROP FUNCTION user_update;
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
	IN in_user_image TEXT,
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
$$ LANGUAGE plpgsql
---------------------------------------------------------------

DROP FUNCTION product_get_by_id;
-- GET A Product BY ID
CREATE OR REPLACE FUNCTION product_get_by_id(IN in_product_id BIGINT) 
RETURNS TABLE(
	out_supplier_id BIGINT,
	out_product_status_id BIGINT,
	out_product_unit_price FLOAT,
	out_product_whole_sale_price FLOAT,
	out_product_retail_price FLOAT,
	out_product_unit_price_discount FLOAT,
	out_product_category VARCHAR,
	out_product_description TEXT,
	out_product_image TEXT,
	out_product_name VARCHAR,
	out_product_addition_date TIMESTAMP,
	out_last_modification_date TIMESTAMP,
	out_last_modified_by BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	supplier_id,
	product_status_id,
	product_unit_price,
	product_whole_sale_price,
	product_retail_price,
	product_unit_price_discount,
	(
		SELECT
			category_name
		FROM
			category
		WHERE
			product_category = CAST(category_id AS BIGINT)
	),
	product_description,
	product_image,
	product_name,
	product_addition_date,
	last_modification_date,
	last_modified_by
	FROM	product
	WHERE	CAST(product_id AS BIGINT) = in_product_id;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION product_get_by_supplier;

-- GET A Product BY SUPPLIER ID
CREATE OR REPLACE FUNCTION product_get_by_supplier(IN in_supplier_id BIGINT) 
RETURNS TABLE(
	out_product_id BIGINT,
	out_product_status_id BIGINT,
	out_product_unit_price FLOAT,
	out_product_whole_sale_price FLOAT,
	out_product_retail_price FLOAT,
	out_product_unit_price_discount FLOAT,
	out_product_category VARCHAR,
	out_product_description TEXT,
	out_product_image TEXT,
	out_product_name VARCHAR,
	out_product_addition_date TIMESTAMP,
	out_last_modification_date TIMESTAMP,
	out_last_modified_by BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(product_id AS BIGINT),
	product_status_id,
	product_unit_price,
	product_whole_sale_price,
	product_retail_price,
	product_unit_price_discount,
	(
		SELECT
			category_name
		FROM
			category
		WHERE
			product_category = CAST(category_id AS BIGINT)
	),
	product_description,
	product_image,
	product_name,
	product_addition_date,
	last_modification_date,
	last_modified_by
	FROM	product
	WHERE	CAST(supplier_id AS BIGINT) = in_supplier_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A Product
DROP FUNCTION product_insert;

CREATE OR REPLACE FUNCTION product_insert (
	IN in_supplier_id BIGINT,
	IN in_product_status_id BIGINT,
	IN in_product_unit_price FLOAT,
	IN in_product_whole_sale_price FLOAT,
	IN in_product_retail_price FLOAT,
	IN in_product_unit_price_discount FLOAT,
	IN in_product_category BIGINT,
	IN in_product_description TEXT,
	IN in_product_image TEXT,
	IN in_product_name VARCHAR,
	IN in_last_modified_by BIGINT,
	OUT out_product_id BIGINT
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
		product (
			supplier_id,
			product_status_id,
			product_unit_price,
			product_unit_price_discount,
			product_category,
			product_description,
			product_image,
			product_name,
			product_addition_date,
			last_modification_date,
			last_modified_by,
			product_whole_sale_price,
			product_retail_price
		)
	VALUES
		(
			in_supplier_id,
			in_product_status_id,
			in_product_unit_price,
			in_product_unit_price_discount,
			in_product_category,
			in_product_description,
			in_product_image,
			in_product_name,
			CURRENT_TIMESTAMP,
			CURRENT_TIMESTAMP,
			in_last_modified_by,
			in_product_whole_sale_price,
			in_product_retail_price
	) RETURNING CAST(product_id AS BIGINT) INTO out_product_id;
EXCEPTION
WHEN OTHERS THEN 
	out_product_id := -1;
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

DROP FUNCTION product_update;

-- UPDATE A product
CREATE OR REPLACE FUNCTION product_update (
	IN in_product_id BIGINT,
	IN in_product_status_id BIGINT,
	IN in_product_unit_price FLOAT,
	IN in_product_whole_sale_price FLOAT,
	IN in_product_retail_price FLOAT,
	IN in_product_unit_price_discount FLOAT,
	IN in_product_category BIGINT,
	IN in_product_description TEXT,
	IN in_product_image TEXT,
	IN in_product_name VARCHAR,
	IN in_last_modified_by BIGINT,
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
	UPDATE	product 
	SET
	product_status_id = COALESCE(in_product_status_id, product_status_id),
	product_unit_price = COALESCE(in_product_unit_price, product_unit_price),
	product_whole_sale_price = COALESCE(in_product_whole_sale_price, product_whole_sale_price),
	product_retail_price = COALESCE(in_product_retail_price, product_retail_price),
	product_unit_price_discount = COALESCE(in_product_unit_price_discount,product_unit_price_discount),
	product_category = COALESCE(in_product_category,product_category),
	product_description = COALESCE(in_product_description,product_description),
	product_image = COALESCE(in_product_image,product_image),
	product_name =COALESCE( in_product_name, product_name),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by = COALESCE(in_last_modified_by, last_modified_by)
	WHERE
	CAST(product_id AS BIGINT) = in_product_id;
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
---------------------------------------------------------------
DROP FUNCTION retailer_get_marketplace_products;
CREATE OR REPLACE FUNCTION retailer_get_marketplace_products(
  IN in_retailer_id BIGINT, 
  IN in_page_size INTEGER, 
  IN in_page_index INTEGER
)
RETURNS TABLE(		
  out_product_id BIGINT,
  out_product_name VARCHAR,
  out_product_description TEXT, 
  out_product_image TEXT,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT,
  out_product_supplier BIGINT
) AS $$
BEGIN
RETURN QUERY 
  WITH retailer_establishment AS (
    SELECT retailstore_est_id 
    FROM retailstore_owned_get(in_retailer_id)
  ),
  retailer_categories AS (
    SELECT out_category_id 
    FROM retailstore_categories_get((SELECT retailstore_est_id FROM retailer_establishment))
  ),
  products_with_compliance AS (
    SELECT 
      p.product_id,
      p.product_name,
      p.product_description,
      p.product_image,
      p.product_retail_price,
      p.product_unit_price,
      p.product_whole_sale_price,
      s.supplier_compliance_indicator,
      p.supplier_id
    FROM product p
    JOIN supplier s ON p.supplier_id = s.supplier_id
    WHERE p.product_category = ANY(SELECT out_category_id FROM retailer_categories)
      AND p.product_status_id = (
        SELECT product_status_id 
        FROM product_status 
        WHERE product_status LIKE '%PUBLISHED%'
      )
  )
  SELECT 
    CAST(product_id AS BIGINT) AS out_product_id,
    product_name AS out_product_name,
    product_description AS out_product_description,
    product_image AS out_product_image,
    product_retail_price AS out_product_retail_price,
    product_unit_price AS out_product_unit_price,
    product_whole_sale_price AS out_product_whole_sale_price,
    supplier_id
  FROM products_with_compliance
  ORDER BY supplier_compliance_indicator DESC
  LIMIT in_page_size
  OFFSET ((in_page_index - 1) * in_page_size);
END;
$$ LANGUAGE plpgsql;
------------------------------------------------------------------------------
-- SP NO.:#8, 
-- Complexity: MODERATE,
-- Creation Data: 04122024,
-- Desc: Gets Products filtered by Entered Category / Industry
-- NodeJS Model: Product
DROP FUNCTION fetch_products_by_industry_and_category;
CREATE OR REPLACE FUNCTION fetch_products_by_industry_and_category(
  IN industry_types BIGINT[], -- Array of industry types
  IN categories BIGINT[],     -- Array of categories
  IN page_size INTEGER,       -- Pagination: page size
  IN page_index INTEGER       -- Pagination: page index
)
RETURNS TABLE(		
  out_product_id BIGINT,
  out_product_name VARCHAR,
  out_product_description TEXT, 
  out_product_image TEXT,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT,
  out_supplier_id BIGINT,
  total_records_count BIGINT
) AS $$
DECLARE
  v_total_count BIGINT; -- Variable to store total count
BEGIN
  -- Calculate the total records count
  SELECT COUNT(*)
  INTO v_total_count
  FROM product p
  WHERE 
    (
      -- Check if categories array is NULL or if product belongs to the given categories
      categories IS NULL OR p.product_category = ANY(categories)
    )
    AND (
      -- Check if industry types array is NULL or if product belongs to an industry type
      industry_types IS NULL OR p.product_category IN (
        SELECT category_id 
        FROM category
        WHERE industry_type = ANY(industry_types)
      )
    );

  -- Return the paginated results with total count included in each row
  RETURN QUERY 
  SELECT 
    CAST(p.product_id AS BIGINT) AS out_product_id,
    p.product_name AS out_product_name,
    p.product_description AS out_product_description,
    p.product_image AS out_product_image,
    p.product_retail_price AS out_product_retail_price,
    p.product_unit_price AS out_product_unit_price,
    p.product_whole_sale_price AS out_product_whole_sale_price,
    p.supplier_id AS out_supplier_id,
    v_total_count AS total_records_count -- Include the total count in each row
  FROM product p
  WHERE 
    (
      -- Check if categories array is NULL or if product belongs to the given categories
      categories IS NULL OR p.product_category = ANY(categories)
    )
    AND (
      -- Check if industry types array is NULL or if product belongs to an industry type
      industry_types IS NULL OR p.product_category IN (
        SELECT category_id 
        FROM category
        WHERE industry_type = ANY(industry_types)
      )
    )
  LIMIT page_size
  OFFSET ((page_index - 1) * page_size);
END;
$$ LANGUAGE plpgsql;
----------------------------------------------------------------------------------------------
-- SP NO.:#8, 
-- Complexity: MODERATE,
-- Creation Data: 04122024,
-- Desc: Search Products by Search Term
-- NodeJS Model: Product
DROP FUNCTION search_products;
CREATE OR REPLACE FUNCTION search_products(
  IN search_term TEXT,
  IN page_size INTEGER,
  IN page_index INTEGER
)
RETURNS TABLE(
  out_product_id BIGINT,
  out_product_name VARCHAR,
  out_product_description TEXT, 
  out_product_image TEXT,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT,
  out_supplier_id BIGINT,
  total_records_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH matching_products AS (
    SELECT 
      p.product_id AS out_product_id,
      p.product_name AS out_product_name,
      p.product_description AS out_product_description,
      p.product_image AS out_product_image,
      p.product_retail_price AS out_product_retail_price,
      p.product_unit_price AS out_product_unit_price,
      p.product_whole_sale_price AS out_product_whole_sale_price,
      p.supplier_id AS out_supplier_id
    FROM product p
    LEFT JOIN category c ON p.product_category = c.category_id
    LEFT JOIN factory f ON p.supplier_id = f.owner_id
    LEFT JOIN establishment e ON f.factory_est_id = e.establishment_id
    WHERE 
      -- Search by product name
      LOWER(p.product_name) LIKE LOWER('%' || search_term || '%')
      OR
      -- Search by category name
      LOWER(c.category_name) LIKE LOWER('%' || search_term || '%')
      OR
      -- Search by establishment name
      LOWER(e.establishment_name) LIKE LOWER('%' || search_term || '%')
  ),
  total_count AS (
    SELECT COUNT(*) AS total_records_count
    FROM matching_products
  )
  SELECT 
    CAST(p.out_product_id AS BIGINT),
    p.out_product_name,
    p.out_product_description,
    p.out_product_image,
    p.out_product_retail_price,
    p.out_product_unit_price,
    p.out_product_whole_sale_price,
    p.out_supplier_id,
    tc.total_records_count
  FROM matching_products p, total_count tc
  ORDER BY p.out_product_name
  LIMIT page_size
  OFFSET ((page_index - 1) * page_size);
END;
$$ LANGUAGE plpgsql;
--------------------------------------------------------------------------
-- SP NO.:#9, 
-- Complexity: MODERATE,
-- Creation Data: 04122024,
-- Desc: Get Supplier Related Products
-- NodeJS Model: Product
DROP FUNCTION get_supplier_details;

CREATE OR REPLACE FUNCTION get_supplier_details(
  IN in_supplier_id BIGINT,
  IN page_size INTEGER,
  IN page_index INTEGER
)
RETURNS TABLE(
  supplier_establishment_name TEXT,
  supplier_establishment_logo TEXT,
  supplier_establishment_cover TEXT,
  supplier_industry_type BIGINT[],
  total_products_count BIGINT,
  paginated_products JSONB,
  total_reviews_count BIGINT,
  paginated_reviews JSONB,
  supplier_review_count BIGINT,
  overall_rating FLOAT
) AS $$
DECLARE
  v_total_products_count BIGINT;
  v_total_reviews_count BIGINT;
  v_paginated_products JSONB;
  v_paginated_reviews JSONB;
  v_supplier_review_count BIGINT;
  v_overall_rating FLOAT;
BEGIN
  -- Fetch total product count
  SELECT COUNT(*)
  INTO v_total_products_count
  FROM product p
  WHERE p.supplier_id = in_supplier_id;

  -- Fetch total review count
  SELECT COUNT(*)
  INTO v_total_reviews_count
  FROM review r
  WHERE r.supplier_id = in_supplier_id;

  -- Fetch paginated products as JSONB
  SELECT JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'product_id', p.product_id,
      'product_name', p.product_name,
      'product_description', p.product_description,
      'product_image', p.product_image,
      'product_unit_price', p.product_unit_price,
      'product_whole_sale_price', p.product_whole_sale_price,
      'product_retail_price', p.product_retail_price
    )
  )
  INTO v_paginated_products
  FROM (
    SELECT *
    FROM product p
    WHERE p.supplier_id = in_supplier_id
    ORDER BY p.product_name
    LIMIT page_size
    OFFSET ((page_index - 1) * page_size)
  ) p;

  -- Fetch paginated reviews as JSONB
  SELECT JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'review_id', r.review_id,
      'review_rating', r.rating,
      'review_text', r.review_comment,
      'review_date', r.review_date
    )
  )
  INTO v_paginated_reviews
  FROM (
    SELECT *
    FROM review r
    WHERE r.supplier_id = in_supplier_id
    ORDER BY r.review_date DESC
    LIMIT page_size
    OFFSET ((page_index - 1) * page_size)
  ) r;

  -- Fetch supplier review count and overall rating
  SELECT 
    COUNT(r.review_id),
    AVG(r.rating)
  INTO 
    v_supplier_review_count,
    v_overall_rating
  FROM review r
  WHERE r.supplier_id = in_supplier_id;

  -- Fetch supplier establishment details
  RETURN QUERY
  SELECT 
    e.establishment_name AS supplier_establishment_name,
    e.establishment_logo AS supplier_establishment_logo,
    e.establishment_cover AS supplier_establishment_cover,
    e.industry_type_spec AS supplier_industry_type,
    v_total_products_count,
    v_paginated_products,
    v_total_reviews_count,
    v_paginated_reviews,
    v_supplier_review_count,
    v_overall_rating
  FROM establishment e
  JOIN supplier s ON e.establishment_id = (SELECT factory_est_id FROM factory WHERE owner_id = in_supplier_id)
  WHERE s.supplier_id = in_supplier_id;
END;
$$ LANGUAGE plpgsql;
---------------------------------------------------------------
-- TO CLEAR BYTEA VALUES
UPDATE PRODUCT SET product_image = NULL;
---------------------------------------------------------------

drop function quotation_insert;
-- INSERT A Quotation
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
---------------------------------------------------------------
drop function order_insert;
CREATE OR REPLACE FUNCTION order_insert (
	IN in_quotation_id 		 BIGINT,
	IN in_product_id  		 BIGINT,
	IN in_order_quantity   	 FLOAT,
	IN in_order_price  FLOAT,
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
			CURRENT_TIMESTAMP,
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
-------------------------------------------------------------

CREATE OR REPLACE FUNCTION purchase_insert (
	IN in_quotation_id 	       	   BIGINT,
	IN in_buyer_id 		           BIGINT,
	IN in_supplier_id 		       BIGINT,
	IN in_purchase_status_id 	       BIGINT,
	IN in_payment_reference	  	   VARCHAR,
	IN in_reconciliation_reference   VARCHAR,
	IN in_external_pay_reference     VARCHAR,
	IN in_payment_amount		  	   FLOAT,
	IN in_payment_currency	  	   CHAR,
	IN in_payment_exchange_rate	   FLOAT ,
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
		CURRENT_TIMESTAMP              ,
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
-------------------------------------------------------------
drop function purchase_transaction_insert;
-- INSERT A purchase
CREATE OR REPLACE FUNCTION purchase_transaction_insert (
	IN in_purchase_id 			 BIGINT,
	IN in_transaction_status_id 	 BIGINT,
	IN in_transaction_details     JSONB,
	IN in_last_modification_date     TIMESTAMP,
	IN in_last_modified_by		   BIGINT,
	OUT out_purchase_transaction_id BIGINT
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
	purchase_transaction (
		purchase_id 			 ,
		transaction_status_id 	 ,
		transaction_date	     ,
		transaction_details     ,
		last_modification_date     ,
		last_modified_by		   
	)
	VALUES
	(
		in_purchase_id,
		in_transaction_status_id,
		CURRENT_TIMESTAMP,
		in_transaction_details,
		CURRENT_TIMESTAMP,
		in_last_modified_by	
	) RETURNING CAST(purchase_transaction_id AS BIGINT) INTO out_purchase_transaction_id;
EXCEPTION
WHEN OTHERS THEN 
	out_purchase_transaction_id := -1;
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
-------------------------------------------------------------
ALTER TABLE supplier ADD COLUMN supplier_overall_rating INTEGER DEFAULT NULL;
DROP FUNCTION supplier_get_by_id;
CREATE OR REPLACE FUNCTION supplier_get_by_id(IN in_supplier_id BIGINT)
RETURNS TABLE(		
	out_supplier_user_id    BIGINT,
	out_supplier_tax_identification_num    VARCHAR,
	out_supplier_bank_account_num    VARCHAR,
	out_supplier_iban    VARCHAR,
	out_supplier_compliance_indicator FLOAT,
	out_supplier_complaint_count 	    INTEGER,
	out_supplier_positive_review_count INTEGER,
	out_supplier_overall_rating INTEGER

) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	supplier_user_id,
	supplier_tax_identification_num,
	supplier_bank_account_num,
	supplier_iban,
	supplier_compliance_indicator,
	supplier_complaint_count 	,
	supplier_positive_review_count,
	supplier_overall_rating
	FROM supplier
	WHERE CAST(supplier_id AS BIGINT) = in_supplier_id;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION get_supplier_compliance_statistics;
-- GET A Supplier Statistics 
CREATE OR REPLACE FUNCTION get_supplier_compliance_statistics (
IN in_supplier_id BIGINT
)
RETURNS TABLE(		
	out_supplier_compliance_indicator FLOAT,
	out_supplier_complaint_count 	    INTEGER,
	out_supplier_positive_review_count INTEGER,
	out_supplier_overall_rating INTEGER
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	supplier_compliance_indicator,
	supplier_complaint_count 	,
	supplier_positive_review_count,
	supplier_overall_rating
	FROM supplier
	WHERE CAST(supplier_id AS BIGINT) = in_supplier_id;
END;
$$ LANGUAGE plpgsql;
-------------------------------------------------------------
DROP FUNCTION review_get_by_supplier;
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
	CAST(review_id AS BIGINT)	   ,
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
DROP FUNCTION review_get_by_retailer;

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
	CAST(review_id AS BIGINT)	   ,
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

DROP FUNCTION review_get_by_id;

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
	CAST(review_id AS BIGINT)	   ,
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
-----------------------------------------------------------------------
alter table complaint add column complaint_title varchar(400) default 'default';
drop function complaint_get_all;
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

drop function complaint_get_by_id;
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


drop function complaint_insert;
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

-----------------------------------------------------------------------
-- TABLE: Notification
-- TYPE: Main

CREATE TABLE notification ( 
	notification_id SERIAL PRIMARY KEY,
	notification_type    BIGINT,
	notified_user_id    BIGINT,
	notification_priority INTEGER NOT NULL,
	notification_subject   VARCHAR(254) NOT NULL,
	notification_details   TEXT DEFAULT NULL,
	is_read BOOLEAN NOT NULL DEFAULT FALSE,
	creation_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_notified_user_id FOREIGN KEY (notified_user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_notification_type FOREIGN KEY (notification_type)
    REFERENCES notification_type(notification_type_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_notif_priority 	  CHECK(notification_priority IN(0, 1, 2))
);
/*
Notification Indexes  / Triggers
*/

-- Notification User ID Index
-- to optimize the Retrieval Based on a given Notification's UserID
CREATE INDEX  idx_notification_user_id ON notification(notified_user_id);
-- Notification Priority Index
-- to optimize the Retrieval Based on a given Notification's Number of Priority
CREATE INDEX  idx_notification_priority ON notification(notification_priority);

/*
Notification CRUD Functions
*/

CREATE OR REPLACE FUNCTION notification_insert(
    IN in_notification_type BIGINT,
    IN in_notified_user_id BIGINT,
    IN in_notification_priority INTEGER,
    IN in_notification_subject VARCHAR,
    IN in_notification_details TEXT,
    IN in_last_modified_by BIGINT,
    OUT out_notification_id BIGINT
)
RETURNS BIGINT AS $$
BEGIN
    INSERT INTO notification (
        notification_type,
        notified_user_id,
        notification_priority,
        notification_subject,
        notification_details,
        is_read,
        creation_date,
        last_modification_date,
        last_modified_by
    ) VALUES (
        in_notification_type,
        in_notified_user_id,
        in_notification_priority,
        in_notification_subject,
        in_notification_details,
        FALSE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        in_last_modified_by
    )
    RETURNING CAST(notification_id AS BIGINT) INTO out_notification_id;
EXCEPTION
    WHEN OTHERS THEN
        out_notification_id := -1;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_notifications_by_user_id(
    IN in_user_id BIGINT,
    IN in_page_size INTEGER,
    IN in_page_index INTEGER
)
RETURNS TABLE(
    notification_id BIGINT,
    notification_type BIGINT,
    notification_priority INTEGER,
    notification_subject VARCHAR,
    notification_details TEXT,
    is_read BOOLEAN,
    creation_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CAST(n.notification_id AS BIGINT),
        n.notification_type,
        n.notification_priority,
        n.notification_subject,
        n.notification_details,
        n.is_read,
        n.creation_date
    FROM notification n
    WHERE n.notified_user_id = in_user_id
    ORDER BY n.creation_date DESC
    LIMIT in_page_size
    OFFSET ((in_page_index - 1) * in_page_size);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION mark_notification_as_read(
    IN in_notification_id BIGINT,
    IN in_last_modified_by BIGINT
)
RETURNS INTEGER AS $$
BEGIN
    UPDATE notification
    SET is_read = TRUE,
        last_modification_date = CURRENT_TIMESTAMP,
        last_modified_by = in_last_modified_by
    WHERE CAST(notification_id AS BIGINT)= in_notification_id;

    RETURN 0;
EXCEPTION
    WHEN OTHERS THEN
        RETURN -1;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION delete_notification(
    IN in_notification_id BIGINT
)
RETURNS INTEGER AS $$
BEGIN
    DELETE FROM notification
    WHERE CAST(notification_id AS BIGINT)= in_notification_id;

    RETURN 0;
EXCEPTION
    WHEN OTHERS THEN
        RETURN -1;
END;
$$ LANGUAGE plpgsql;


-----------------------------------------------------------------------
-- UPDATE A Retailer
CREATE OR REPLACE FUNCTION retailer_update (
	IN in_retailer_id    BIGINT,
	IN in_retailer_user_id    BIGINT,
	IN in_retailer_tax_identification_num    VARCHAR,
	IN in_retailer_bank_account_num    VARCHAR,
	IN in_retailer_iban    VARCHAR,
	IN in_retailer_compliance_indicator FLOAT,
	IN in_retailer_complaint_count 	    INTEGER,
	IN in_last_modified_by	 BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
    UPDATE retailer 
	SET	
	retailer_tax_identification_num = COALESCE(in_retailer_tax_identification_num, retailer_tax_identification_num),
	retailer_bank_account_num= COALESCE(in_retailer_bank_account_num, retailer_bank_account_num),
	retailer_iban= COALESCE(in_retailer_iban, retailer_iban),
	retailer_compliance_indicator= COALESCE(in_retailer_compliance_indicator, retailer_compliance_indicator),
	retailer_compliance_count= COALESCE(in_retailer_complaint_count, retailer_compliance_count),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by)

	WHERE CAST(retailer_id AS BIGINT) = in_retailer_id;
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

-----------------------------------------------------------------------

-- INSERT AN Establishment
CREATE OR REPLACE FUNCTION establishment_insert(
	IN in_establishment_status    BIGINT,
	IN in_industry_type    BIGINT[],
	IN in_establishment_name TEXT,
	IN in_commercial_registration_num BIGINT,
	IN in_establishment_registration_date TIMESTAMP,
	IN in_contact_number VARCHAR,
	IN in_establishment_email VARCHAR,
	IN in_establishment_website TEXT,
	IN in_establishment_description TEXT,
	IN in_establishment_type BOOLEAN,
	IN in_establishment_city VARCHAR,
	IN in_establishment_street VARCHAR,
	IN in_establishment_building_num VARCHAR,
	IN in_establishment_logo       TEXT,
	IN in_establishment_cover       TEXT,
	IN in_est_compliance_indicator FLOAT,
	IN in_est_compliance_indicator_desc VARCHAR,
	IN last_modifier BIGINT,
	OUT out_establishment_id BIGINT
)
RETURNS BIGINT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
INSERT INTO establishment (
		establishment_status,
		establishment_name,
		commercial_registration_num,
		establishment_registration_date,
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		industry_type_spec,
		establishment_logo      ,
		establishment_cover      ,
		est_compliance_indicator,
		est_compliance_indicator_desc,
		last_modification_date,
		last_modified_by
	) VALUES
	(
		in_establishment_status,
		in_establishment_name,
		in_commercial_registration_num,
		in_establishment_registration_date,
		in_contact_number,
		in_establishment_email,
		in_establishment_website,
		in_establishment_description,
		in_establishment_type,
		in_establishment_city,
		in_establishment_street,
		in_establishment_building_num,
		in_industry_type,
		in_establishment_logo,
		in_establishment_cover,
		in_est_compliance_indicator,
		in_est_compliance_indicator_desc,
		CURRENT_TIMESTAMP,
		last_modifier
	) RETURNING CAST(establishment_id AS BIGINT) INTO out_establishment_id;		
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
	out_establishment_id:= -1;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------
-- GET A Product BY SUPPLIER ID
drop function product_get_by_supplier;
CREATE OR REPLACE FUNCTION product_get_by_supplier(IN in_supplier_id BIGINT, IN in_page_size INT, IN in_page_index INT) 
RETURNS TABLE(
		in_commercial_registration_num,
		in_establishment_registration_date,
		in_contact_number,
		in_establishment_email,
		in_establishment_website,
		in_establishment_description,
		in_establishment_type,
		in_establishment_city,
		in_establishment_street,
		in_establishment_building_num,
		in_industry_type,
		in_establishment_logo,
		in_establishment_cover,
		in_est_compliance_indicator,
		in_est_compliance_indicator_desc,
		CURRENT_TIMESTAMP,
		last_modifier
	) RETURNING CAST(establishment_id AS BIGINT) INTO out_es
	out_product_id BIGINT,
	out_product_status_id BIGINT,
	out_product_unit_price FLOAT,
	out_product_whole_sale_price FLOAT,
	out_product_retail_price FLOAT,
	out_product_unit_price_discount FLOAT,
	out_product_category BIGINT,
	out_product_description TEXT,
	out_product_image TEXT,
	out_product_name VARCHAR,
	out_product_addition_date TIMESTAMP,
	out_last_modification_date TIMESTAMP,
	out_last_modified_by BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(product_id AS BIGINT),
	product_status_id,
	product_unit_price,
	product_whole_sale_price,
	product_retail_price,
	product_unit_price_discount,
	product_category,
	product_description,
	product_image,
	product_name,
	product_addition_date,
	last_modification_date,
	last_modified_by
	FROM	product
	WHERE	CAST(supplier_id AS BIGINT) = in_supplier_id
	LIMIT in_page_size
  	OFFSET ((in_page_index - 1) * in_page_size);
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------
-- 11-12-2024
ALTER TABLE product ADD COLUMN product_view BIGINT DEFAULT 0;
CREATE OR REPLACE FUNCTION product_update_view(IN in_product_id BIGINT) 
RETURNS VOID
AS $$ BEGIN 
	UPDATE	product
	SET product_view = product_view + 1
	WHERE	CAST(product_id AS BIGINT) = in_product_id;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------
ALTER TABLE supplier ADD COLUMN profile_view BIGINT DEFAULT 0;
CREATE OR REPLACE FUNCTION supplier_update_profile_views(IN in_supplier_id BIGINT)
RETURNS VOID AS $$
BEGIN
	UPDATE supplier
	SET profile_view = profile_view + 1
	WHERE CAST(supplier_id AS BIGINT) = in_supplier_id;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------
ALTER TABLE complaint ADD COLUMN is_penalty_resulted BOOLEAN DEFAULT FALSE;
CREATE OR REPLACE FUNCTION complaint_is_penalty(IN in_complaint_id BIGINT) 
RETURNS VOID
AS $$ BEGIN 
	UPDATE	complaint
	SET is_penalty_resulted = TRUE 
	WHERE CAST(complaint_id AS BIGINT) = in_complaint_id;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------
-- 12-12 
CREATE OR REPLACE FUNCTION log_insert(
	IN in_log_user_id BIGINT,
	IN in_action_details 	    TEXT,
	IN in_action_json_payload JSONB,
	IN in_action_description  VARCHAR,
	IN in_is_transactional 	BOOLEAN,
	OUT out_log_id BIGINT
)
RETURNS BIGINT AS $$
BEGIN
    INSERT INTO log
	(	
	log_user_id,
	action_details,
	action_json_payload,
	action_description,
	is_transactional,
	log_timestamp
	)
	VALUES 
	(
	in_log_user_id,
	in_action_details,
	in_action_json_payload,
	in_action_description,
	in_is_transactional,
	CURRENT_TIMESTAMP
	) RETURNING CAST(log_id AS BIGINT) INTO out_log_id;

EXCEPTION WHEN OTHERS THEN 
	out_log_id := -1;	
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------

-- UPDATE A Supplier
CREATE OR REPLACE FUNCTION supplier_update (
	IN in_supplier_id    BIGINT,
	IN in_supplier_user_id    BIGINT,
	IN in_supplier_tax_identification_num    VARCHAR,
	IN in_supplier_bank_account_num    VARCHAR,
	IN in_supplier_iban    VARCHAR,
	IN in_supplier_compliance_indicator FLOAT,
	IN in_supplier_complaint_count 	    INTEGER,
	IN in_supplier_positive_review_count INTEGER,
	IN in_last_modified_by	 BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
    UPDATE supplier 
	SET	
	supplier_tax_identification_num = COALESCE(in_supplier_tax_identification_num, supplier_tax_identification_num),
	supplier_bank_account_num= COALESCE(in_supplier_bank_account_num, supplier_bank_account_num),
	supplier_iban= COALESCE(in_supplier_iban, supplier_iban),
	supplier_compliance_indicator= COALESCE(in_supplier_compliance_indicator, supplier_compliance_indicator),
	supplier_complaint_count= COALESCE(in_supplier_complaint_count, supplier_complaint_count),
	supplier_positive_review_count= COALESCE(in_supplier_positive_review_count, supplier_positive_review_count),	
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by)

	WHERE CAST(supplier_id AS BIGINT) = in_supplier_id;
	update_res := 0;	

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
	 update_res := -1;	
END;
$$ LANGUAGE plpgsql;
---------------------------------------------------------------------
-- 13-12-2024
ALTER TABLE complaint drop constraint chk_cmpn_status;
alter table complaint add	CONSTRAINT chk_cmpn_status CHECK(complaint_status_id IN('CREATED', 'UNDERREVIEW', 'RESOLVED', 'REJECTED'));
select * from product_status_get_all();
update product_status set product_status = 'DRAFTED' WHERE product_status_id = 2;
update product_status set product_status = 'PUBLISHED' WHERE product_status_id = 1;
update quotation_status set quotation_status = 'CONFIRMED' WHERE QUOTATION_STATUS_ID = 3;
update quotation_status set quotation_status = 'DECLINED' WHERE QUOTATION_STATUS_ID = 5;
SELECT * FROM quotation_status_get_all() order by quot_status_id asc
UPDATE USER_TYPE SET USER_TYPE = 'RETAILER' WHERE USER_TYPE_ID = 2;
UPDATE USER_TYPE SET USER_TYPE = 'SUPPLIER' WHERE USER_TYPE_ID =3;
SELECT * FROM user_type_get_all();
UPDATE USER_STATUS SET USER_STATUS_ID = 5 WHERE USER_STATUS = 'SUSPENDED'
UPDATE USER_STATUS SET USER_STATUS = 'SUSPENDED' WHERE USER_STATUS.user_status_id = 3;
UPDATE USER_STATUS SET USER_STATUS = 'BANNED' WHERE USER_STATUS.user_status_id = 4;
UPDATE USER_STATUS SET USER_STATUS = 'DELETED' WHERE USER_STATUS.user_status_id = 5;
UPDATE INDUSTRY_TYPE SET INDUSTRY_TYPE_ID = 8 WHERE INDUSTRY_TYPE = 'FOODANDBEVERAGE';
UPDATE INDUSTRY_TYPE SET INDUSTRY_TYPE_ID = 7 WHERE INDUSTRY_TYPE = 'AUTOMOTIVE';
UPDATE INDUSTRY_TYPE SET INDUSTRY_TYPE_ID = 6 WHERE INDUSTRY_TYPE = 'TOYS';
UPDATE INDUSTRY_TYPE SET INDUSTRY_TYPE_ID = 5 WHERE INDUSTRY_TYPE = 'OUTDOORS';
CREATE OR REPLACE FUNCTION insert_salt_new_password()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	-- Hash the new password
	NEW.user_password = (SELECT crypt(NEW.user_password, gen_salt('md5'))) ;
	RETURN NEW;
END;
$$
DROP TRIGGER before_insert_userpass ON user_localized;
CREATE TRIGGER before_insert_userpass
BEFORE INSERT ON user_localized
FOR EACH ROW
EXECUTE FUNCTION insert_salt_new_password();

ALTER TABLE CATEGORY ALTER COLUMN category_name TYPE VARCHAR(256);
---------------------------------------------------------------------
-- 15-12-2024
DROP TABLE analytics;
CREATE TABLE analytics ( 
	analytics_id 		 SERIAL PRIMARY KEY,
	user_id 		 	 BIGINT NOT NULL,
	capture    		 	 JSONB NOT NULL,
	capture_date  		 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_anltc_product_id FOREIGN KEY (user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Analytics Product ID Index
-- to optimize the Retrieval Based on a given Analytics's ProductID
CREATE INDEX  idx_fk_user_id ON analytics(user_id);

-- Analytics Capture Date Index
-- to optimize the Retrieval Based on a given Analytics's Capture Date
CREATE INDEX  idx_capture_date ON analytics(capture_date);

DROP FUNCTION analytics_get_by_id(in_analytics_id bigint);
DROP FUNCTION analytics_get_by_date;
DROP FUNCTION analytics_get_by_product(in_product_id bigint);
-- GET Analytics by ID
CREATE OR REPLACE FUNCTION analytics_get_by_user_id(IN in_user_id BIGINT) 
RETURNS TABLE(
    out_analytics_id 		  BIGINT,
    out_capture 			  JSONB,
    out_capture_date		  TIMESTAMP
) 
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CAST(analytics_id AS BIGINT),
        capture ,
        capture_date
    FROM analytics
    WHERE CAST(user_id AS BIGINT) = in_user_id
    ORDER BY capture_date DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION analytics_insert;
-- INSERT Analytics
CREATE OR REPLACE FUNCTION analytics_insert(
    IN in_user_id BIGINT,
    IN in_capture JSONB,
    OUT out_analytics_id BIGINT
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
    INSERT INTO analytics (
        user_id,
        capture,
        capture_date
    ) VALUES (
        in_user_id,
        in_capture,
        CURRENT_TIMESTAMP
    ) RETURNING CAST(analytics_id AS BIGINT) INTO out_analytics_id;
EXCEPTION WHEN OTHERS THEN
    out_analytics_id := -1;
    GET STACKED DIAGNOSTICS
        v_state = RETURNED_SQLSTATE,
        v_msg = MESSAGE_TEXT,
        v_detail = PG_EXCEPTION_DETAIL,
        v_context = PG_EXCEPTION_CONTEXT;
    RAISE NOTICE E'Got exception:
    state: % 
    message: % 
    detail: %
    context: %', v_state, v_msg, v_detail, v_context;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION analytics_update;
-- UPDATE Analytics
CREATE OR REPLACE FUNCTION analytics_update(
    IN in_capture JSONB,
    IN in_analytics_id BIGINT
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
    UPDATE analytics
    SET 
        capture = COALESCE(in_capture, capture),
        capture_date = CURRENT_TIMESTAMP
    WHERE CAST(analytics_id AS BIGINT) = in_analytics_id;
    RETURN 0;
EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS
        v_state = RETURNED_SQLSTATE,
        v_msg = MESSAGE_TEXT,
        v_detail = PG_EXCEPTION_DETAIL,
        v_context = PG_EXCEPTION_CONTEXT;
    RAISE NOTICE E'Got exception:
    state: % 
    message: % 
    detail: %
    context: %', v_state, v_msg, v_detail, v_context;
    RETURN -1;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION analytics_delete;
-- DELETE Analytics
CREATE OR REPLACE FUNCTION analytics_delete(IN in_analytics_id BIGINT) 
RETURNS INTEGER 
AS $$
BEGIN
    DELETE FROM analytics
    WHERE CAST(analytics_id AS BIGINT) = in_analytics_id;
    RETURN 0;
EXCEPTION WHEN OTHERS THEN
    RETURN -1;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------
-- 17-12-2024
DROP FUNCTION application_get_by_id;
-- GET APPLICATION DATA
CREATE OR REPLACE FUNCTION application_get_by_id(IN in_application_id BIGINT)
RETURNS TABLE(	
        out_application_id BIGINT,
        out_user_first_name VARCHAR,
        out_user_last_name VARCHAR,
        out_user_name VARCHAR,
        out_user_email VARCHAR,
        out_user_password  VARCHAR,
        out_user_phone_number VARCHAR,
        out_establishment_name TEXT,
        out_establishment_contact_number VARCHAR,
        out_establishment_email VARCHAR,
        out_establishment_description TEXT,
        out_establishment_commercial_registration_num BIGINT,
        out_establishment_city VARCHAR,
        out_establishment_street VARCHAR,
        out_establishment_building_num VARCHAR,
        out_establishment_industry_type_spec    BIGINT[],
        out_establishment_logo       TEXT,
        out_user_type INT,
		out_application_request_date TIMESTAMP
) 
AS $$
BEGIN
    RETURN QUERY 
	SELECT 
		CAST(application_id AS BIGINT),
        user_first_name ,
        user_last_name ,
        user_name ,
        user_email ,
        user_password  ,
        user_phone_number ,
        establishment_name ,
        establishment_contact_number ,
        establishment_email ,
        establishment_description ,
        establishment_commercial_registration_num ,
        establishment_city ,
        establishment_street ,
        establishment_building_num ,
        establishment_industry_type_spec    ,
        establishment_logo,
        user_type,
		creation_date

	FROM application
    WHERE CAST(application_id AS BIGINT) = in_application_id;
END;
$$ LANGUAGE plpgsql;
----------------------------------------------------
drop function category_get_by_industry;
CREATE OR REPLACE FUNCTION category_get_by_industry(IN in_industry_type BIGINT) 
RETURNS TABLE (
	out_category_id            BIGINT,
	out_category_name  		   VARCHAR
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(category_id AS BIGINT),
	category_name
	FROM	category
	WHERE	CAST(industry_type AS BIGINT) = in_industry_type;
END;
$$ LANGUAGE plpgsql;
--------------------------------------------------------------
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
	out_supplier_address		  TEXT,
	out_payment_method			  VARCHAR,
	out_supp_email 				   VARCHAR,
	out_ret_email 				   VARCHAR,
	out_supp_contact 				   VARCHAR,
	out_ret_contact 				   VARCHAR

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
	D.supplier_address,
	K.payment_method,
	R.establishment_email,
	M.establishment_email,
	R.contact_number,
	M.contact_number
	FROM	quotation AS D
	LEFT JOIN purchase AS K ON K.quotation_id = D.quotation_id
	LEFT JOIN purchase_transaction AS L ON L.purchase_id = K.purchase_id
	LEFT JOIN establishment AS R ON R.establishment_id = (SELECT factory_est_id FROM factory WHERE owner_id = D.supplier_id)
	LEFT JOIN establishment AS M ON M.establishment_id = (SELECT retailstore_est_id FROM retailstore WHERE owner_id = D.requester_id)
	
	WHERE D.quotation_id = in_quotation_id;
END;
$$ LANGUAGE plpgsql;
------------------------------------------------------------------------------------------
-- 18-12-2024
DROP FUNCTION complaint_get_by_id;
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
	out_resolution_notes  TEXT,

	out_supp_full_name  VARCHAR,
	out_ret_full_name  VARCHAR,
	out_supp_email VARCHAR,
	out_ret_email  VARCHAR,
	out_supp_contact  VARCHAR,
	out_ret_contact  VARCHAR,
	out_supp_establishment  VARCHAR,
	out_ret_establishment   VARCHAR,
	out_supp_establishment_id  BIGINT,
	out_ret_establishment_id   BIGINT
) 
AS $$ 
BEGIN 
    RETURN QUERY
    SELECT 
	CAST(c.complaint_id AS BIGINT), 
	c.complaint_title,
	c.complaint_type_id , 
	c.quotation_id,
	c.reviewer_id , 
	c.supplier_id , 
	c.retailer_id , 
	c.complaint_status_id , 
	c.complaint_notes  , 
	c.submitter_type  , 
	c.creation_date  , 
	c.resolution_notes,

	CAST(s.first_name || ' ' || s.last_name AS VARCHAR),
	CAST(r.first_name || ' ' || r.last_name AS VARCHAR)	,
	CAST(f.establishment_email AS VARCHAR),
	CAST(rt.establishment_email	AS VARCHAR),
	CAST(f.contact_number AS VARCHAR),
	CAST(rt.contact_number	AS VARCHAR),
	CAST(f.establishment_name AS VARCHAR),
	CAST(rt.establishment_name	AS VARCHAR),
	CAST(f.establishment_id AS BIGINT),
	CAST(rt.establishment_id AS BIGINT)

    FROM 
        complaint c
	LEFT JOIN user_localized s ON s.user_id = (SELECT supplier_user_id FROM supplier WHERE supplier_id = c.supplier_id)
	LEFT JOIN user_localized r ON r.user_id = (SELECT retailer_user_id FROM retailer WHERE retailer_id = c.retailer_id)
	LEFT JOIN establishment f  ON f.establishment_id = (SELECT factory_est_id FROM factory WHERE owner_id = c.supplier_id)
	LEFT JOIN establishment rt ON rt.establishment_id = (SELECT retailstore_est_id FROM retailstore WHERE owner_id = c.retailer_id)
    WHERE 
        CAST(complaint_id AS BIGINT) = in_complaint_id;

END;
$$ LANGUAGE plpgsql;
