create table class_feedback (
	class_id bigint not null,
    from_user_id int not null,
    to_user_id int not null,
    feedback_time datetime,
    score decimal,
    comment text,
    remark text,

    primary key(class_id, from_user_id, to_user_id),
    foreign key fk_class(class_id)
    references classes(class_id)
    on update cascade
    on delete restrict,

    foreign key fk_from_user(from_user_id)
    references users(user_id)
    on update cascade
    on delete cascade,

    foreign key fk_to_user(to_user_id)
    references users(user_id)
    on update cascade
    on delete cascade
) engine = innodb