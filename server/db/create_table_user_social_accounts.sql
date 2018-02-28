create table user_social_accounts (
	user_id int(11) not null,
    facebook_id varchar(20),
    facebook_name varchar(255),
    facebook_data text,
    wechat_openid varchar(30),
    wechat_unionid varchar(30),
    wechat_name varchar(255),
    wechat_data text,


    foreign key fk_user(user_id)
    references users(user_id)

    on update cascade
    on delete restrict
) engine = innodb