-- THIS IS THE DATABASE CODE FILE
-- LIST TABLES CREATED ALONG WITH THEIR COLUMNS
select
    t.table_name,
    array_agg(c.column_name::text) as columns
from
    information_schema.tables t
inner join information_schema.columns c on
    t.table_name = c.table_name
where
    t.table_schema = 'public'
    and t.table_type= 'BASE TABLE'
    and c.table_schema = 'public'
group by t.table_name;