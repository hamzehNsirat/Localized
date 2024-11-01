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
	establishment_building_num VARCHAR(15) NOT NULL,
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
	establishment_building_num VARCHAR,
	number_of_tries INTEGER,
	number_of_max_tries INTEGER,
	is_final_failed BOOLEAN,
	creation_date  TIMESTAMP,
	last_modification_date  TIMESTAMP,
	last_modified_by		 BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	N.notification_id,
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
	N.establishment_building_num,
	N.number_of_tries,
	N.number_of_max_tries,
	N.is_final_failed,
	N.creation_date,
	N.last_modification_date,
	N.last_modified_by,
	(SELECT COUNT(*) FROM notification D WHERE D.is_final_failed = FALSE) AS total_records_count
	FROM notification N
	ORDER BY notification_id DESC
	LIMIT in_page_size
	OFFSET in_page_index;

END;
$$ LANGUAGE plpgsql;
