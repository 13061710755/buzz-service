create table user_balance_history (
	user_id int(11) not null,
    timestamp datetime default current_timestamp,
    type enum('h'),
    event enum('charge', 'consume'),
    amount decimal,
    remark text,

    primary key (user_id, timestamp),

    foreign key fk_user(user_id)
    references users(user_id)
    on update cascade
    on delete restrict
) engine = innodb