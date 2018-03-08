create table user_balance (
                 	user_id int(11) not null,
                     class_hours int,

                     primary key (user_id),

                     foreign key fk_user(user_id)
                     references users(user_id)
                     on update cascade
                     on delete cascade
                 ) engine = innodb