-- TABLE: Analytics
-- TYPE: Main

CREATE TABLE analytics ( 
	analytics_id 		 SERIAL PRIMARY KEY,
	product_id 		 	 BIGINT NOT NULL,
	trends    		 	 JSONB NOT NULL,
	sales_count   		 INTEGER  DEFAULT 0,
	views_count   		 INTEGER  DEFAULT 0,
	capture_date  		 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_anltc_product_id FOREIGN KEY (product_id)
    REFERENCES product(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT chk_anltc_sales CHECK(sales_count >= 0),
	CONSTRAINT chk_anltc_views CHECK(views_count >= 0)
);
