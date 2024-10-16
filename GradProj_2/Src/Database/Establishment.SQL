-- TABLE: Establishment
-- TYPE: Main

CREATE TABLE establishment ( 
	establishment_id SERIAL PRIMARY KEY,
	establishment_status    BIGINT,
	industry_type    BIGINT,
	establishment_name TEXT,
	commercial_registration_num BIGINT NOT NULL UNIQUE,
	establishment_registration_date TIMESTAMP NOT NULL,
	contact_number VARCHAR(15) NOT NULL,
	establishment_email VARCHAR(254) NOT NULL UNIQUE,
	establishment_website TEXT DEFAULT NULL,
	establishment_description TEXT NOT NULL,
	establishment_type BOOLEAN NOT NULL,
	establishment_city VARCHAR(254) NOT NULL,
	establishment_street VARCHAR(254) NOT NULL,
	establishment_building_num VARCHAR(15) NOT NULL,
	establishment_longitude FLOAT,
	establishment_latitude  FLOAT,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_establishment_status FOREIGN KEY (establishment_status)
    REFERENCES establishment_status(establishment_status_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_industry FOREIGN KEY (industry_type)
    REFERENCES industry_type(industry_type_id) ON DELETE SET NULL ON UPDATE CASCADE
);
