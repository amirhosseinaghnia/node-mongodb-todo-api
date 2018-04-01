// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to server');
    }
    console.log('connected to mongodb server');

    // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').findOneAndDelete({completed: 'true'}).then((result) => {
    //     console.log(result);
    // });

    //chalenges
    //1
    // db.collection('Users').deleteMany({name: 'amirhossein'}).then((res) => {
    //     console.log(res);
    // });

    //2
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5abab2cc787dfc158480b727')
    }).then((res) => {
        console.log(res);
    });

    // db.close();

});