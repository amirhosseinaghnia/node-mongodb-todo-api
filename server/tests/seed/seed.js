const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

var personOneId = new ObjectID();
var personTwoId = new ObjectID();
var users = [{
    _id: personOneId,
    email: 'amirhossein1908@gmail.com',
    password: 'personOnePass',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: personOneId.toHexString(), access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: personTwoId,
    email: 'amir1908@gmail.com',
    password: 'personTwoPass'
}];

var todos = [{
    _id: new ObjectID(),
    text: 'firs todo test'
}, {
    _id: new ObjectID(),
    text: 'second todo test',
    completed: true,
    completedAt: 444
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
};

module.exports = {todos, populateTodos, users, populateUsers};