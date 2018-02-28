create table users (
	user_id int(11) not null auto_increment,
    name varchar(255) default null,
    role enum('s', 'c', 'a'),
    created_at datetime default current_timestamp,
    primary key(user_id)
) engine = InnoDB