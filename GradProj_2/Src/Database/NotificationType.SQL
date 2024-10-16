-- TABLE: Notification Type
-- TYPE: Look up

CREATE TABLE notification_type (
	notification_type_id SERIAL PRIMARY KEY,
	notification_type    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);