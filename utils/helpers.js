const { data } = require('../socketIO/data')

const addUser = (username) => {
    return new Promise((resolve, reject) => {
        data.users.push(username)
        resolve(data.users)
    })
}

const getUsers = () => {
    return data.users
}

const getUserByUsername = (username) => {
    return data.users.find(user => user.username === username)
}

const getUserBySocketId = (id) => {
    return data.users.find(user => user.socketId === id)
}

const removeUserBySocketId = (id) => {
    return new Promise((resolve, reject) => {
        data.users = data.users.filter(user => user.socketId !== id)
        resolve(data.users)
    })
}

module.exports = { addUser, getUsers, getUserByUsername, getUserBySocketId, removeUserBySocketId }