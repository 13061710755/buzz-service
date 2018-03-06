create table classes (
	class_id bigint(11) not null auto_increment,
    adviser_id int not null,
    level text,
    start_time datetime,
    end_time datetime,
    status enum('opened', 'cancelled', 'ready', 'started', 'ended'),
	name varchar(255),
    remark text,
    topic varchar(255),
    exercises text,
    room_url varchar(255),

    primary key(class_id),

--    foreign key fk_user(adviser_id)
--    references users(user_id)

    on update cascade
    on delete restrict

) engine=innodb