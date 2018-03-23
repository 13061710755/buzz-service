async function getCurrentIntegral(trx, user_id) {
    return await trx('user_balance')
        .select('integral')
        .where({ user_id })
}

async function consumeIntegral(trx, userId, integral, remark = '') {
    await trx('user_balance_history')
        .insert({
            user_id: userId,
            type: 'i',
            event: 'consume',
            amount: -integral,
            remark,
        })
    const currentIntegral = await getCurrentIntegral(trx, userId)

    const newIntegral = {
        user_id: userId,
        integral: (currentIntegral.length > 0 ? currentIntegral[0].integral : 0) - Number(integral),
    }

    if (currentIntegral.length > 0) {
        await trx('user_balance')
            .where('user_id', userId)
            .update(newIntegral)
    } else {
        await trx('user_balance').insert(newIntegral)
    }
}

async function chargeIntegral(trx, userId, integral, remark = '') {
    await trx('user_balance_history')
        .insert({
            user_id: userId,
            type: 'i',
            event: 'charge',
            amount: integral,
            remark,
        })

    const currentIntegral = await getCurrentIntegral(trx, userId)

    const newIntegral = {
        user_id: userId,
        integral: Number(integral) + (currentIntegral.length > 0 ? Number(currentIntegral[0].integral) : 0),
    }

    if (currentIntegral.length > 0) {
        await trx('user_balance')
            .where('user_id', userId)
            .update(newIntegral)
    } else {
        await trx('user_balance').insert(newIntegral)
    }
}

module.exports = {
    consume: consumeIntegral,
    charge: chargeIntegral,
}
