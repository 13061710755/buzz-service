create table user_placement_tests (
	user_id int(11) not null auto_increment,
    detail json default null,
    level varchar(255) default null,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp,

    primary key(user_id)
) engine = InnoDB