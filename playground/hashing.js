const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$xr0dsLJDHSky62RKFJz6hOfIKorhqFgSLpzRRVSIL8lrQAQOPlCoq';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, 'abc123');
// console.log(token);

// var decoded = jwt.verify(token, 'abc123');
// console.log(decoded);

// var message = 'i am amirhossein';
// var hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString();

// var resHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resHash === token.hash) {
//     console.log('data was not changed');
// } else {
//     console.log('data was changed. Do not trust');
// };