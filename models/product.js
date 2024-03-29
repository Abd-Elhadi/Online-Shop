const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: mongoose.rusted
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);


// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     // console.log(this.id);
//     // console.log(this._id);
//     if (this.id) {
//       // Update the product
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this.id }, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then(result => {
//         // console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static fetchAll () {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find().toArray()
//       .then(products => {
//         // console.log(products);
//         return products;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static findById(id) {
//     const db = getDb();
//     // console.log(id);
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then(product => {
//         // console.log(product);
//         return product;
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }

//   static removeById(prodId) {
//     const db = getDb();
//     // let's see
//     return db
//     .collection('products')
//     .deleteOne( {"_id": new mongodb.ObjectId(prodId)})
//     .then(result => {
//       console.log("Deleted");
//     })
//     .catch(err => {
//       console.log(err);
//     });
//     console.log('Done?');
//   }
// }

// // const Product = sequelize.define('product', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   title: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   price: {
// //     type: Sequelize.DOUBLE,
// //     allowNull: false
// //   },
// //   imageUrl: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   description: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   }
// // });

// module.exports = Product;