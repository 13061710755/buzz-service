const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || 'test'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)
const wechat = require('../common/wechat')
const qiniu = require('../common/qiniu')
const Stream = require('stream')
const crypto = require('crypto')

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
        .select('users.user_id as user_id', 'users.name as name', 'users.created_at as created_at',
            'users.role as role', 'users.remark as remark', 'user_profiles.avatar as avatar',
            'user_profiles.display_name as display_name', 'user_profiles.gender as gender',
            'user_profiles.date_of_birth as date_of_birth', 'user_profiles.mobile as mobile',
            'user_profiles.email as email', 'user_profiles.language as language', 'user_profiles.location as location',
            'user_profiles.description as description', 'user_profiles.grade as grade',
            'user_profiles.parent_name as parent_name', 'user_profiles.country as country',
            'user_profiles.city as city', 'user_social_accounts.facebook_id as facebook_id',
            'user_social_accounts.wechat_data as wechat_data', 'user_social_accounts.facebook_name as facebook_name',
            'user_social_accounts.wechat_name as wechat_name', 'user_balance.class_hours as class_hours',
            'user_placement_tests.level as level', 'user_profiles.password as password',
            knex.raw('group_concat(user_interests.interest) as interests'))
}

function selectUsers() {
    return selectFields(joinTables())
}

function filterByTime(search, start_time = new Date(1900, 1, 1), end_time = new Date(2100, 1, 1)) {
    return search
        .andWhereRaw('(exists (select * from student_class_schedule where student_class_schedule.start_time >= ? and student_class_schedule.end_time < ?) or exists (select * from companion_class_schedule where companion_class_schedule.start_time >= ? and companion_class_schedule.end_time < ?))', [start_time, end_time, start_time, end_time])
}

const search = async ctx => {
    try {
        const filters = {}
        if (ctx.query.role) {
            filters['users.role'] = ctx.query.role
        }

        let search = joinTables()
            .orderBy('users.created_at', 'desc')

        if (Object.keys(filters).length) {
            search = search.where(filters)
        }

        if (ctx.query.mobile) {
            search = search.andWhere('user_profiles.mobile', 'like', `%${ctx.query.mobile}%`)
        }

        if (ctx.query.email) {
            search = search.andWhere('user_profiles.email', 'like', `%${ctx.query.email}%`)
        }

        if (ctx.query.wechat_name) {
            search = search.andWhere('user_social_accounts.wechat_name', 'like', `%${ctx.query.wechat_name}%`)
        }

        if (ctx.query.display_name) {
            console.log('searching by name = ', ctx.query.display_name, decodeURIComponent(ctx.query.display_name))
            search = search.andWhereRaw('(user_profiles.display_name like ? or users.name like ?)', [`%${ctx.query.display_name}%`, `%${ctx.query.display_name}%`])
        }

        if (ctx.query.start_time || ctx.query.end_time) {
            search = filterByTime(search, ctx.query.start_time, ctx.query.end_time)
        }

        ctx.body = await selectFields(search)
        console.log(ctx.body)
    } catch (error) {
        console.error(error)

        ctx.status =
        ctx.body = { error: error.message }
    }
}
const show = async ctx => {
    try {
        const { user_id } = ctx.params
        const users = await selectUsers()
            .where({ 'users.user_id': user_id })

        if (!users.length) {
            throw new Error('The requested user does not exists')
        }

        ctx.body = users[0]
    } catch (error) {
        console.error(error)

        ctx.status = 404
        ctx.body = {
            error: error.message,
        }
    }
}

const getByFacebookId = async ctx => {
    try {
        const { facebook_id } = ctx.params
        const users = await selectUsers()
            .where({ 'user_social_accounts.facebook_id': facebook_id })

        if (!users.length) {
            throw new Error('The requested user does not exists')
        }

        ctx.body = users[0]
    } catch (ex) {
        console.error(ex)

        ctx.status = 404
        ctx.body = {
            error: ex.message,
        }
    }
}

const getByWechat = async ctx => {
    try {
        const { openid, unionid } = ctx.query
        if (!openid && !unionid) {
            throw new Error('Please specifiy a openid or unionid')
        }

        const filter = {}
        if (openid) {
            filter['user_social_accounts.wechat_openid'] = openid
        }
        if (unionid) {
            filter['user_social_accounts.wechat_unionid'] = unionid
        }

        console.log('filter = ', filter)

        const users = await selectUsers().where(filter)

        if (!users.length) {
            throw new Error('The requested user does not exists')
        }

        ctx.body = users[0]
    } catch (ex) {
        console.error(ex)

        ctx.status = 404
        ctx.body = {
            error: ex.message,
        }
    }
}

const create = async ctx => {
    const trx = await promisify(knex.transaction)

    try {
        const { body } = ctx.request

        const users = await trx('users')
            .returning('user_id')
            .insert({
                name: body.name || '',
                role: body.role,
                created_at: new Date(),
                user_id: body.user_id || undefined,
            })

        if (!users.length) {
            throw new Error('The user already exists')
        }

        const userProfile = await trx('user_profiles').insert({
            user_id: users[0],
            avatar: body.avatar || '',
        })

        const userSocialAccounts = await trx('user_social_accounts').insert({
            user_id: users[0],
            facebook_id: body.facebook_id || null,
            facebook_name: body.facebook_name || '',
            wechat_openid: body.wechat_openid || null,
            wechat_unionid: body.wechat_unionid || null,
            wechat_name: body.wechat_name || null,
        })

        await trx.commit()

        ctx.status = 201
        ctx.set('Location', `${ctx.request.URL}/${users[0]}`)
        ctx.body = users[0]
    } catch (error) {
        console.error(error)

        await trx.rollback()
        ctx.status = 409
        ctx.body = {
            error: 'The user already exists',
        }
    }
}


const signInByMobileOrEmail = async ctx => {
    const {mobile, email, password} = ctx.request.body;

    //判断用户输入的手机号、邮箱、密码是否为空
    if (!mobile) {
        if (!email) {
            /*throw new Error('please enter your phone number or email address')*/
            return ctx.throw(403, 'Please enter your phone number or email address')
        }
    }
    if (!password) {
        /*throw new Error('please enter your password')*/
        return ctx.throw(403, 'Please enter your password')
    }

    //通过用户的手机号或邮箱查询用户信息
    const filterMobile = {'user_profiles.mobile': mobile}
    const filterEmail = {'user_profiles.email': email}

    if (mobile){
       var users = await selectUsers().where(filterMobile)
    }
    if (email) {
        var users = await selectUsers().where(filterEmail)
    }

    if (!users.length) {
        return ctx.throw(404, 'The requested user does not exists')
    }else {
        //用户输入的密码和查询返回的users信息中的密码进行比较
        //使用md5加密
        const md5 = crypto.createHash('md5')
        md5.update(password)
        const md5digest = md5.digest('hex')

        if (users[0].password === md5digest) {
            //把将要返回的用户信息中的密码置为空
            users[0].password = ''

            ctx.cookies.set('user_id', users[0].user_id, {httpOnly: true, expires: 0})
            ctx.body = users[0]
        }else {
            /*throw new Error('Account or password error')*/
            return ctx.throw(403, 'Account or password error')
        }
    }
}

const signIn = async ctx => {
    const { user_id, facebook_id, wechat_openid, wechat_unionid } = ctx.request.body

    if (!user_id) {
        return ctx.throw(403, 'sign in not allowed')
    }

    const filter = { 'users.user_id': user_id }

    const users = await selectUsers().where(filter)

    if (!users.length) {
        return ctx.throw(404, 'The requested user does not exists')
    }

    ctx.cookies.set('user_id', user_id, { httpOnly: true, expires: 0 })
    ctx.body = users[0]
}

function makeUpdations(updations) {
    console.log('updating ...', updations)
    const result = {}

    Object.keys(updations).map(prop => {
        if (typeof updations[prop] !== 'undefined') {
            result[prop] = updations[prop]
        }

        return prop
    })

    return result
}

const updateUsersTable = async function (body, trx, ctx) {
    const user = makeUpdations({
        name: body.name,
        role: body.role,
        remark: body.remark,
    })

    if (Object.keys(user).length > 0) {
        const users = await trx('users')
            .where('user_id', ctx.params.user_id)
            .update(user)
    }
}
const updateUserProfilesTable = async function (body, trx, ctx) {
    const profiles = makeUpdations({
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
        state: body.state,
    })
    if (Object.keys(profiles).length > 0) {
        const userProfile = await trx('user_profiles')
            .where('user_id', ctx.params.user_id)
            .update(profiles)
    }
}
const updateUserAccountsTable = async function (body, trx, ctx) {
    const accounts = makeUpdations({
        facebook_id: body.facebook_id,
        facebook_name: body.facebook_name,
        wechat_openid: body.wechat_openid,
        wechat_unionid: body.wechat_unionid,
    })
    if (Object.keys(accounts).length > 0) {
        const userSocialAccounts = await trx('user_social_accounts')
            .where('user_social_accounts.user_id', ctx.params.user_id)
            .update(accounts)
    }
}
const updateUserInterestsTable = async function (body, trx, ctx) {
    if (body.interests) {
        const deleted = await trx('user_interests')
            .where('user_interests.user_id', ctx.params.user_id)
            .del()

        console.log('deleted = ', deleted)

        const values = body.interests.map(i => ({ user_id: ctx.params.user_id, interest: i }))

        console.log('inserting ...', values)
        const inserted = await trx('user_interests')
            .insert(values)

        console.log('inserted = ', inserted)
    }
}
const update = async ctx => {
    const trx = await promisify(knex.transaction)

    try {
        const { body } = ctx.request
        await updateUsersTable(body, trx, ctx)
        await updateUserProfilesTable(body, trx, ctx)
        await updateUserAccountsTable(body, trx, ctx)
        await updateUserInterestsTable(body, trx, ctx)
        await trx.commit()

        ctx.status = 200
        ctx.set('Location', `${ctx.request.URL}`)
        ctx.body = (await selectUsers().where('users.user_id', ctx.params.user_id))[0]
    } catch (error) {
        console.error('updating user error: ', error)

        await trx.rollback()
        ctx.status = 409
        ctx.body = error
    }
}

const deleteByUserID = async ctx => {
    const trx = await promisify(knex.transaction)
    try {
        const userID = ctx.params.user_id

        const deleted = await trx('users')
            .where('user_id', userID)
            .del()

        if (deleted <= 0) {
            throw new Error('The user does not exist!')
        }

        await trx.commit()
        ctx.status = 200
        ctx.body = 'delete success'

        console.log('delete success:', deleted)
    } catch (error) {
        console.error('delete user error: ', error)

        await trx.rollback()
        ctx.status = 409
        ctx.body = error
module.exports = {
    search,
    show,
    getByFacebookId,
    getByWechat,
    create,
    signIn,
    signInByMobileOrEmail,
    update,
    delete: deleteByUserID
}
