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


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://new-admin:<password>@cluster0.5kdpvq0.mongodb.net/?retryWrites=true&w=majority";

const mongoConnect = (callback) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    callback(client);
}


module.exports = mongoConnect;