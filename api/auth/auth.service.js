const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(username, password, email) {
    logger.debug(`auth.service - login with username: ${username}`)
    console.log(email);
    let user = !!password ? await userService.getByUsername(username) : await userService.getByEmail(email)
    console.log(user);
    // const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password or email')
    // TODO: un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    user._id = user._id.toString()
    return user
}


async function signup({ username, password, fullname, imgUrl, stations, likedSongs, email }) {
    const saltRounds = 10
    let emailAddres = ''
    let hash = ''
    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password && !email || !fullname) return Promise.reject('Missing required signup information')

    if (email) emailAddres = await userService.getByEmail(email)
    const userExist = await userService.getByUsername(username)
    if (userExist, emailAddres) return Promise.reject('Username already taken')


    if (password) hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname, imgUrl, stations, followedStations: [], likedSongs, email })
}


function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user._id))
}

async function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        const userToReturn = await userService.getById(loggedinUser)
        return userToReturn

    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}


module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}