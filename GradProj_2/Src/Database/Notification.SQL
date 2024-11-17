-- TABLE: Notification
-- TYPE: Main

CREATE TABLE notification ( 
	notification_id SERIAL PRIMARY KEY,
	notification_type    BIGINT,
	notified_user_id    BIGINT,
	notification_priority INTEGER NOT NULL,
	notification_email     VARCHAR(254) NOT NULL,
	notification_phone_num VARCHAR(15) DEFAULT NULL,
	notification_message   JSONB,
	notification_subject   VARCHAR(254) NOT NULL,
	is_email_verified	   BOOLEAN NOT NULL,
	notification_status 	 INTEGER NOT NULL DEFAULT 0 ,
	notification_status_desc VARCHAR(15) NOT NULL DEFAULT 'CREATED',
	number_of_tries INTEGER NOT NULL DEFAULT 0,
	number_of_max_tries INTEGER NOT NULL DEFAULT 3,
	is_final_failed BOOLEAN NOT NULL DEFAULT FALSE,
	creation_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_notified_user_id FOREIGN KEY (notified_user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_notification_type FOREIGN KEY (notification_type)
    REFERENCES notification_type(notification_type_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_notif_priority 	  CHECK(notification_priority IN(0, 1, 2)),
	CONSTRAINT chk_notif_status 	  CHECK(notification_status IN(0, 1, 2, 3, 4)),
	CONSTRAINT chk_notif_status_desc  CHECK(notification_status_desc IN('CREATED', 'SENT', 'PENDING', 'COMPLETED', 'FAILED')),
	CONSTRAINT chk_notif_num_tries    CHECK(number_of_tries IN(0, 1, 2)),
	CONSTRAINT chk_notif_maxnum_tries CHECK(number_of_max_tries = 3)
);
/*
Notification Indexes  / Triggers
*/

-- Notification User ID Index
-- to optimize the Retrieval Based on a given Notification's UserID
CREATE INDEX  idx_notification_user_id ON notification(notified_user_id);

-- Notification Status Index
-- to optimize the Retrieval Based on a given Notification's Status
CREATE INDEX  idx_notification_status ON notification(notification_status);

-- Notification Type Index
-- to optimize the Retrieval Based on a given Notification's Notification Type
CREATE INDEX  idx_notification_type ON notification(notification_type);


-- Notification Priority Index
-- to optimize the Retrieval Based on a given Notification's Number of Priority
CREATE INDEX  idx_notification_priority ON notification(notification_priority);

/*
Notification CRUD Functions
*/
-- ONLY GET BY PAGE SIZE AND INDEX
CREATE OR REPLACE FUNCTION notifications_insert (
	IN in_notification_type    BIGINT,
	IN in_notified_user_id    BIGINT,
	IN in_notification_priority INTEGER,
	IN in_notification_email     VARCHAR,
	IN in_notification_phone_num VARCHAR,
	IN in_notification_message   JSONB,
	IN in_notification_subject   VARCHAR,
	IN in_is_email_verified	   BOOLEAN,
	IN in_notification_status 	 INTEGER ,
	IN in_notification_status_desc VARCHAR,
	IN in_number_of_tries INTEGER,
	IN in_number_of_max_tries INTEGER,
	IN in_is_final_failed BOOLEAN,
	IN in_last_modified_by BIGINT
)
RETURNS INTEGER
AS $$
BEGIN
	INSERT INTO notification
	(
		notification_type,
		notified_user_id,
		notification_priority,
		notification_email,
	    notification_phone_num,
	    notification_message,
	    notification_subject,
	    is_email_verified,
	    notification_status,
	    notification_status_desc,
	    number_of_tries,
	    number_of_max_tries,
	    is_final_failed,
	    creation_date,
	    last_modification_date,
	    last_modified_by
    
	)
	VALUES
	( 
		in_notification_type,
		in_notified_user_id,
		in_notification_priority,
		in_notification_email,
		in_notification_phone_num,
		in_notification_message,
		in_notification_subject,
		in_is_email_verified,
		in_notification_status,
		in_notification_status_desc,
		in_number_of_tries,
		in_number_of_max_tries,
		in_is_final_failed,
		CURRENT_TIMESTAMP,
		CURRENT_TIMESTAMP,
		in_last_modified_by
	);
	RETURN 0;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1;	
END;
$$ LANGUAGE plpgsql;

-- ONLY GET BY PAGE SIZE AND INDEX
CREATE OR REPLACE FUNCTION notifications_get (
	IN in_page_size INT,
	IN in_page_index INT
)
RETURNS TABLE(		
	notification_id BIGINT,
	notification_type    BIGINT,
	notified_user_id    BIGINT,
	notification_priority INTEGER,
	notification_email     VARCHAR,
	notification_phone_num VARCHAR,
	notification_message   JSONB,
	notification_subject   VARCHAR,
	is_email_verified	   BOOLEAN,
	notification_status 	 INTEGER,
	notification_status_desc VARCHAR,
	number_of_tries INTEGER,
	number_of_max_tries INTEGER,
	is_final_failed BOOLEAN,
	creation_date  TIMESTAMP,
	last_modification_date  TIMESTAMP,
	last_modified_by		 BIGINT,
	out_total_records_count INTEGER
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	CAST(N.notification_id AS BIGINT),
	N.notification_type,
	N.notified_user_id,
	N.notification_priority,
	N.notification_email,
	N.notification_phone_num,
	N.notification_message,
	N.notification_subject,
	N.is_email_verified,
	N.notification_status,
	N.notification_status_desc,
	N.number_of_tries,
	N.number_of_max_tries,
	N.is_final_failed,
	N.creation_date,
	N.last_modification_date,
	N.last_modified_by,
	CAST((SELECT COUNT(*) FROM notification D WHERE D.is_final_failed = FALSE) AS INTEGER) AS total_records_count
	FROM notification N
	ORDER BY notification_id DESC
	LIMIT in_page_size
	OFFSET ((in_page_index - 1) * in_page_size) ;

END;
$$ LANGUAGE plpgsql;

