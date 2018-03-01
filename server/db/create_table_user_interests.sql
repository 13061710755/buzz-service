create table user_interests (
	user_id int(11) not null,
    interest enum('universe', 'business', 'art', 'food', 'environment', 'lifestyle', 'enterainment', 'science', 'technology', 'health', 'sports', 'animal', 'music', 'people', 'politics'),


    foreign key fk_user(user_id)
    references users(user_id)

    on update cascade
    on delete restrict

) engine=innodb