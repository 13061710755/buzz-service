async function getCurrentClassHours(trx, user_id) {
    return await trx('user_balance')
        .select('class_hours')
        .where({user_id: user_id});
}


async function consumeClassHours(trx, userId, classHours, remark = '') {
    await trx('user_balance_history')
        .insert({
            user_id: userId,
            type: 'h',
            event: 'consume',
            amount: -classHours,
            remark: remark
        });
    const currentClassHours = await getCurrentClassHours(trx, userId);

    let newClassHours = {
        user_id: userId,
        class_hours: (currentClassHours.length > 0 ? currentClassHours[0].class_hours : 0) - Number(classHours)
    };

    if (currentClassHours.length > 0) {
        await trx('user_balance')
            .where('user_id', userId)
            .update(newClassHours);
    } else {
        await trx('user_balance').insert(newClassHours);
    }
}


async function chargeClassHours(trx, userId, classHours, remark = '') {
    await trx("user_balance_history")
        .insert({
            user_id: userId,
            type: 'h',
            event: 'charge',
            amount: classHours,
            remark: remark
        });

    const currentClassHours = await getCurrentClassHours(trx, userId);

    let newClassHours = {
        user_id: userId,
        class_hours: Number(classHours) + (currentClassHours.length > 0 ? Number(currentClassHours[0].class_hours) : 0)
    };

    if (currentClassHours.length > 0) {
        await trx('user_balance')
            .where('user_id', userId)
            .update(newClassHours);
    } else {
        await trx('user_balance').insert(newClassHours);
    }
}

module.exports = {
    consume: consumeClassHours,
    charge: chargeClassHours
}
