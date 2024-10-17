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
