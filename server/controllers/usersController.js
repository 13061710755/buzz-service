const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);

function filterByTime(search, start_time = new Date(1900, 1, 1), end_time = new Date(2100, 1, 1)) {
    return search
        .andWhereRaw('(student_class_schedule.start_time >= ? and student_class_schedule.end_time < ?) or (companion_class_schedule.start_time >= ? and companion_class_schedule.end_time < ?)', [start_time, end_time, start_time, end_time])
        ;
}

const search = async ctx => {
    try {
        let filters = {};
        if (ctx.query.role) {
            filters['users.role'] = ctx.query.role;
        }

        let search = knex('users')
            .leftJoin('user_profiles', 'users.user_id', 'user_profiles.user_id')
            .leftJoin('user_social_accounts', 'users.user_id', 'user_social_accounts.user_id')
            .leftJoin('user_interests', 'users.user_id', 'user_interests.user_id')
            .leftJoin('user_balance', 'users.user_id', 'user_balance.user_id')
            .leftJoin('user_placement_tests', 'users.user_id', 'user_placement_tests.user_id')
            .leftJoin('student_class_schedule', 'users.user_id', 'student_class_schedule.user_id')
            .leftJoin('companion_class_schedule', 'users.user_id', 'companion_class_schedule.user_id')
            .groupByRaw('users.user_id');

        if (Object.keys(filters).length) {
            search = search.where(filters);
        }

        if (ctx.query.mobile) {
            search = search.andWhere('user_profiles.mobile', 'like', `%${ctx.query.mobile}%`)
        }

        if (ctx.query.email) {
            search = search.andWhere('user_profiles.email', 'like', `%${ctx.query.email}%`)
        }

        if (ctx.query.wechat_name) {
            search = search.andWhere('user_social_accounts.wechat_name', 'like', `%${ctx.query.wechat_name}%`);
        }

        if (ctx.query.display_name) {
            console.log('searching by name = ', ctx.query.display_name, decodeURIComponent(ctx.query.display_name));
            search = search.andWhereRaw('(user_profiles.display_name like ? or users.name like ?)', [`%${ctx.query.display_name}%`, `%${ctx.query.display_name}%`]);
        }

        if (ctx.query.start_time || ctx.query.end_time) {
            search = filterByTime(search, ctx.query.start_time, ctx.query.end_time);
        }

        ctx.body = await selectFields(search);
        // ctx.body = await search;
    } catch (error) {
        console.error(error);
    }
};
const show = async ctx => {
    try {
        const {user_id} = ctx.params;
        let users = await selectUsers()
            .where({'users.user_id': user_id});

        if (!users.length) {
            throw new Error("The requested user does not exists");
        }

        ctx.body = users[0];
    } catch (error) {
        console.error(error);

        ctx.status = 404;
        ctx.body = {
            error: error.message
        };
    }
};

function joinTables() {
    return knex('users')
        .leftJoin('user_profiles', 'users.user_id', 'user_profiles.user_id')
        .leftJoin('user_social_accounts', 'users.user_id', 'user_social_accounts.user_id')
        .leftJoin('user_interests', 'users.user_id', 'user_interests.user_id')
        .leftJoin('user_balance', 'users.user_id', 'user_balance.user_id')
        .leftJoin('user_placement_tests', 'users.user_id', 'user_placement_tests.user_id')
        .groupByRaw('users.user_id')
}

function selectFields(search) {
    return search
        .select('users.user_id as user_id', 'users.name as name', 'users.created_at as created_at', 'users.role as role', 'user_profiles.avatar as avatar', 'user_profiles.display_name as display_name', 'user_profiles.gender as gender', 'user_profiles.date_of_birth as date_of_birth', 'user_profiles.mobile as mobile', 'user_profiles.email as email', 'user_profiles.language as language', 'user_profiles.location as location', 'user_profiles.description as description', 'user_profiles.grade as grade', 'user_profiles.parent_name as parent_name', 'user_profiles.country as country', 'user_profiles.city as city', 'user_social_accounts.facebook_id as facebook_id', 'user_social_accounts.wechat_data as wechat_data', 'user_social_accounts.facebook_name as facebook_name', 'user_social_accounts.wechat_name as wechat_name', 'user_balance.class_hours as class_hours', 'user_placement_tests.level as level', knex.raw('group_concat(user_interests.interest) as interests'));
}

function selectUsers() {
    return selectFields(joinTables());
}

const getByFacebookId = async ctx => {
    try {
        const {facebook_id} = ctx.params;
        let users = await selectUsers()
            .where({'user_social_accounts.facebook_id': facebook_id});

        if (!users.length) {
            throw new Error('The requested user does not exists');
        }

        ctx.body = users[0];
    } catch (ex) {
        console.error(ex);

        ctx.status = 404;
        ctx.body = {
            error: ex.message
        }
    }
};

const getByWechat = async ctx => {
    try {
        const {openid, unionid} = ctx.query;
        if (!openid && !unionid) {
            throw new Error('Please specifiy a openid or unionid');
        }

        let filter = {};
        if (openid) {
            filter['user_social_accounts.wechat_openid'] = openid;
        }
        if (unionid) {
            filter['user_social_accounts.wechat_unionid'] = unionid;
        }

        console.log('filter = ', filter);

        let users = await selectUsers().where(filter);

        if (!users.length) {
            throw new Error('The requested user does not exists');
        }

        ctx.body = users[0];
    } catch (ex) {
        console.error(ex);

        ctx.status = 404;
        ctx.body = {
            error: ex.message
        }
    }
};

const create = async ctx => {
    let trx = await promisify(knex.transaction);

    try {
        const {body} = ctx.request;

        const users = await trx("users")
            .returning('user_id')
            .insert({
                name: body.name || '',
                role: body.role,
                created_at: new Date(),
                user_id: body.user_id || undefined
            });

        if (!users.length) {
            throw new Error("The user already exists");
        }

        const userProfile = await trx('user_profiles').insert({
            user_id: users[0],
            avatar: body.avatar || ''
        });

        const userSocialAccounts = await trx('user_social_accounts').insert({
            user_id: users[0],
            facebook_id: body.facebook_id || null,
            facebook_name: body.facebook_name || '',
            wechat_openid: body.wechat_openid || null,
            wechat_unionid: body.wechat_unionid || null,
            wechat_name: body.wechat_name || null
        });

        await trx.commit();

        ctx.status = 201;
        ctx.set("Location", `${ctx.request.URL}/${users[0]}`);
        ctx.body = users[0];
    } catch (error) {
        console.error(error);

        await trx.rollback();
        ctx.status = 409;
        ctx.body = {
            error: "The user already exists"
        };
    }
};

const signIn = async ctx => {
    const {user_id, facebook_id, wechat_openid, wechat_unionid} = ctx.request.body;

    if (!user_id) {
        return ctx.throw(403, 'sign in not allowed');
    }

    let filter = {'users.user_id': user_id};

    let users = await selectUsers().where(filter);

    if (!users.length) {
        return ctx.throw(404, 'The requested user does not exists')
    }

    ctx.cookies.set('user_id', user_id, {httpOnly: true, expires: 0});
    ctx.body = users[0];
};

function makeUpdations(updations) {
    console.log('updating ...', updations);
    let result = {};

    Object.keys(updations).map(prop => {
        if (typeof updations[prop] !== 'undefined') {
            result[prop] = updations[prop];
        }
    });

    return result;
}

let updateUsersTable = async function (body, trx, ctx) {
    let user = makeUpdations({
        name: body.name,
        role: body.role
    });

    if (Object.keys(user).length > 0) {
        const users = await trx("users")
            .where('user_id', ctx.params.user_id)
            .update(user);
    }
};
let updateUserProfilesTable = async function (body, trx, ctx) {
    let profiles = makeUpdations({
        avatar: body.avatar,
        display_name: body.display_name,
        gender: body.gender,
        date_of_birth: body.date_of_birth,
        description: body.description,
        mobile: body.mobile,
        email: body.email,
        language: body.language,
        location: body.location,
        grade: body.grade,
        parent_name: body.parent_name,
        update_at: new Date(),
        country: body.country,
        city: body.city,
        state: body.state
    });
    if (Object.keys(profiles).length > 0) {
        const userProfile = await trx('user_profiles')
            .where('user_id', ctx.params.user_id)
            .update(profiles);
    }
};
let updateUserAccountsTable = async function (body, trx, ctx) {
    let accounts = makeUpdations({
        facebook_id: body.facebook_id,
        facebook_name: body.facebook_name,
        wechat_openid: body.wechat_openid,
        wechat_unionid: body.wechat_unionid
    });
    if (Object.keys(accounts).length > 0) {
        const userSocialAccounts = await trx('user_social_accounts')
            .where('user_social_accounts.user_id', ctx.params.user_id)
            .update(accounts);
    }
};
let updateUserInterestsTable = async function (body, trx, ctx) {
    if (body.interests) {
        let deleted = await trx('user_interests')
            .where('user_interests.user_id', ctx.params.user_id)
            .del();

        console.log('deleted = ', deleted);

        let values = body.interests.map(i => {
            return {'user_id': ctx.params.user_id, 'interest': i}
        });

        console.log('inserting ...', values);
        let inserted = await trx('user_interests')
            .insert(values);

        console.log('inserted = ', inserted);
    }
};
const update = async ctx => {
    let trx = await promisify(knex.transaction);

    try {
        const {body} = ctx.request;
        await updateUsersTable(body, trx, ctx);
        await updateUserProfilesTable(body, trx, ctx);
        await updateUserAccountsTable(body, trx, ctx);
        await updateUserInterestsTable(body, trx, ctx);
        await trx.commit();

        ctx.status = 200;
        ctx.set("Location", `${ctx.request.URL}`);
        ctx.body = (await selectUsers().where('users.user_id', ctx.params.user_id))[0];
    } catch (error) {
        console.error('updating user error: ', error);

        await trx.rollback();
        ctx.status = 409;
        ctx.body = error;
    }
};
module.exports = {index: search, show, getByFacebookId, getByWechat, create, signIn, update};