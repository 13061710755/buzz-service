create table user_interests (
	user_id int(11) not null,
    interest enum('football', 'volleyball', 'ping-pang', 'basketball'),


    foreign key fk_user(user_id)
    references users(user_id)

    on update cascade
    on delete restrict

) engine=innodb