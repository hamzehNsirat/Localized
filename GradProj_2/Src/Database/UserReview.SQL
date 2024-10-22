-- TABLE: User Review
-- TYPE: Main

CREATE TABLE user_review ( 
	user_review_id SERIAL PRIMARY KEY,
	admin_id        BIGINT, 
	user_id   		BIGINT,
	decision_taken  VARCHAR(35) NOT NULL,
	decision_reason TEXT DEFAULT NULL,
	creation_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_urev_user_id FOREIGN KEY (user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE,
	CONSTRAINT fk_urev_reviewer_id FOREIGN KEY (admin_id)
    REFERENCES adminstrator(admin_id) ON DELETE SET NULL,
	CONSTRAINT chk_urev_decision_taken CHECK(decision_taken IN('ADMITTANCE', 'DEFERRAL', 'FREEZING', 'REJECTION'))
);
