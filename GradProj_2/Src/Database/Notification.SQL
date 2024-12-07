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

