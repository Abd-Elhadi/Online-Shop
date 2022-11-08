// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', '12345', {
//     dialect: 'mysql', 
//     host: 'localhost'
// });

// module.exports = sequelize;

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// const mongoConnect = (callback) => {
//     MongoClient.connect(
//         'mongodb+srv://new-admin:admin12345@cluster0.5kdpvq0.mongodb.net/?retryWrites=true&w=majority'
//     )
//     .then(result => {
//         console.log('Connected!');
//         callback(result);
//     })
//     .catch(err => {
//         console.log(err);
//     });
// };

// let _db;

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://new-admin:admin12345@cluster0.5kdpvq0.mongodb.net/?retryWrites=true&w=majority";

// const mongoConnect = (callback) => {
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//     // const client = new MongoClient(uri);
//     console.log('Connected');
//     _db = client.db();
//     callback(client);
// }

// const getDb = () => {
//     if (_db) {
//         // console.log(_db);
//         return _db;
//     }
//     throw 'No database found!';
// }

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let connectionString = "mongodb+srv://new-admin:admin12345@cluster0.5kdpvq0.mongodb.net/?retryWrites=true&w=majority";

let db

const mongoConnect = () => {
    mongodb.connect(
        connectionString,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, client) {
          db = client.db()
          app.listen(5000)
        }
    )
};

const getDb = () => {
    if (db) {
        console.log(_db);
        return db;
    }
    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

