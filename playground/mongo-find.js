// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to server');
    }
    console.log('connected to mongodb server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5ab958a7dc9e2c0b244940f1')
    // }).toArray().then((docs) => {
    //     console.log('Todos :');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log(err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos : ${count}`);
    // }, (err) => {
    //     console.log(err);
    // });

    db.collection('Users').find({name: 'amirhossein'}).count().then((count) => {
        console.log(`Users count: ${count}`);
    }, (err) => {
        console.log(err);
    });
    
    // db.close();

});