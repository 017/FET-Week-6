const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const joi = require('joi');

// const db = require('./db');
// const { db } = require('mongodb');
// const { response } = require('express');
// const { nextTick } = require('process');
// const collection = 'items';
// const app = express();

const schema = joi.object().keys({
  item : joi.string().require()
});

app.get('/', (requ, res) => {
  res.sendFile(path.join(_dirname, 'index.html'));
});

app.get('/getItems', (req, res) => {
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    if (err) {
      console.log();
    } else {
      console.log(documents);
      res.json(documents);
    }
  });
});

app.get('/getItemTypes', (req, res) => {
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    if (err) {
      console.log();
    } else {
      console.log(documents);
      res.json(documents);
    }
  });
});

app.put('/:id', (req, res) => {
  const toDoID = req.params.id;
  constUserInput = req.body;

  db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(ItemID)}, {set : {item :userInput.item}}, {returnOriginal : false}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

app.post('/', (req, res, next) => {
  const userInput = req.body;

  joi.validate(userInput, schema, (err, result) => {
    if (err) {
      const error = new Error("ItemInventory: Invalid Input");
      error.status = 400;
      next(error);
    } 
    else {
      db.getDB().collection(collection).insertOne(userInput, (err, result) => {
        if (err) {
          const error = new Error("ItemInventory: Failed to insert Item Document");
          error.status = 400;
          next(error);
        } else {
          res.json({result : result, document : result.ops[0], msg : "ItemInventory: Inserted Item Successfully", error : null});
        }
      });
    }
  });
  db.getDB().collection(collection).insertOne(userInput, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({result : result, document : result.ops[0]});
    }
  });
});

app.delete('/:id', (req, res) => {
  const ItemID = req.params.id;

  db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(ItemID)}, {set : {item :userInput.item}}, {returnOriginal : false}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

db.connect((err) => {
  if (err) {
    console.log('ItemInventory: Unable to connect to database.');
    process.exit(1);
  }
  else {
    app.listen(3000, () => {
      console.log('ItemInventory: Connected to Database! Listening on Port 3000.');
    });
  }
});