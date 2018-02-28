create table student_class_schedule (
	user_id int(11) not null,
    class_id bigint,
    start_time datetime,
    end_time datetime,
    status enum('booking', 'cancelled', 'confirmed', 'ready', 'started', 'ended', 'terminated'),


    foreign key fk_user(user_id)
    references users(user_id)

    on update cascade
    on delete restrict,

    foreign key fk_class(class_id)
    references classes(class_id)

    on update cascade
    on delete restrict

) engine=innodb