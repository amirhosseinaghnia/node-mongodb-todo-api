const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var userId = '5ac4a4bb64a6292b34d328ac';

User.findById(userId).then((user) => {
    if (!user) {
        return console.log('id not found');
    }
    console.log(`User: ${user}`);
}).catch((e) => {
    console.log(e);
});

// var id = '5ad4fc5cc47a2db407a2d1601';

// if (!ObjectId.isValid(id)) {
//     console.log('Id is not valid');
// }

// Todo.find({
//     _id: id 
// }).then((todos) => {
//     console.log(`Todos: ${todos}`);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log(`Todo: ${todo}`);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log(`Todo By Id: ${todo}`);
// }).catch((e) => {
//     console.log(e);
// });