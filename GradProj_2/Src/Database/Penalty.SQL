-- TABLE: Penalty
-- TYPE: Main

CREATE TABLE penalty ( 
	penalty_id SERIAL PRIMARY KEY,
	penalty_type_id    BIGINT,
	establishment_id   BIGINT NOT NULL,
	penalty_initiator_id BIGINT,
	penalty_status_id 	 VARCHAR(15) NOT NULL DEFAULT 'CREATED',
	penalty_notes  TEXT,
	creation_date  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_pnlt_establishment_id FOREIGN KEY (establishment_id)
    REFERENCES establishment(establishment_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_pnlt_initiator_id FOREIGN KEY (penalty_initiator_id)
    REFERENCES adminstrator(admin_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_pnlt_type_id FOREIGN KEY (penalty_type_id)
    REFERENCES penalty_type(penalty_type_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_pnlt_status CHECK(penalty_status_id IN('CREATED', 'APPLIED', 'POSTPONED', 'DISABLED'))
);
/*
Penalty Indexes  / Triggers
*/

-- Penalty Status ID Index
-- to optimize the Retrieval Based on a given Penalty's Status ID
CREATE INDEX  idx_penalty_status_id ON penalty(penalty_status_id);

-- Penalty Establishment Index
-- to optimize the Retrieval Based on a given Penalty's  Establishment ID
CREATE INDEX  idx_fk_establishment_id ON penalty(establishment_id);
