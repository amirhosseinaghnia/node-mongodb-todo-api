const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to server');
    }
    console.log('connected to mongodb server');

    // db.collection('Todos').insertOne({
    //     text: 'something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('unable to insert todos', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    // db.collection('Users').insertOne({
    //     name: 'amirhossein',
    //     age: 26,
    //     location: 'Tehran'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('unable to insert users', err);
    //     }
    //     // console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
    // });

    // db.close();

});