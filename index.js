const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = "crud_ItemInventory";
const url = {useNewUrlParser: true};

const state = {
  db: null
};

const connect = (cb) => {
  if (state.db) {
    cb();
  } else {
    MongoClient.connect(url, mongoOptions, (err, client) => {
      if (err) {
        cb(err);
      } else {
        state.db = client.db(dbname);
        cb();
      }
    });
  }
};

const getPrimaryKey = (_id) => {
  return ObjectID(_id);
};

const getDB = () => {
  return state.db;
};

module.exports = {getDB, connect, getPrimaryKey};

class Item {
  constructor(name) {
    this.name = name;
    this.types = [];
  }
}

class Type {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

class ItemService {
  constructor() {
    this.url = 'https://someurl.com/api/items';
  }
  

  static getAllItems() {
    return $.get(this.url);
  }

  static getItem(id) {
    return $.get(this.url + `/${id}`);
  }

  static createItem(item) {
    return $.post(this.url, item);
  }

  static updateItem(item) {
    return $.ajax({
      url: this.url + `/${item._id}`,
      dataType: 'json',
      data: JSON.stringify(item),
      contentType: 'application/json',
      type: 'PUT'
    });
  }

  static deleteItem(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: 'DELETE'
    });
  }
}

class DOMManager {
  constructor() {
  }

  static items;

  static getAllItems() {
    ItemService.getAllItems().then(items => this.render(items));
  }

  static createItem(id) {
    ItemService.createItem(new Item(name))
    .then(() => {
      return ItemService.getAllItems();
    })
    .then((items) => this.render(items));
  }

  static deleteItem(id) {
    ItemService.deleteItem(id)
    .then(() => {
      return ItemService.getAllItems();
    })
    .then((items) => this.render(items));
  }

  static addItem(id) {
    for (let item of this.items) {
      if (item._id == id) {
        item.type.push(new Type($(`#${item._id}-item-name`).val(), $(`#${item._id}-type`).val()));
        ItemService.updateItem(item)
        .then(() => {
          return ItemService.getAllItems();
        })
        .then((items) => this.render(items));
      }
    }
  }

  static deleteType(itemID, roomID) {
    for (let item of this.items) {
      if (item._id == itemID) {
        for (let type of item.types) {
          if (type._id == roomID) {
            item.types.splice(item.types.indexOf(type), 1);
            ItemService.updateItem(item)
            .then(() => {
              return ItemService.getAllItems();
            })
            .then((items) => this.render(items));
          }
        }
      }
    }
  }

  static render(items) {
    this.items = items;
    $('#app').empty(); //clear the div each time before updating
    for (let item of items) {
      $('#app').prepend(
        `
        <div id="${item._id}" class="card">
          <div class="card-header">
            <h2>${item.name}</h2>
            <button class="btn btn-danger" onclick="DOMManager.deleteItem("${item._id}")">Delete Item</button>
          </div>
          <div class="card-body">
            <div class="card">
              <div class="row">
                <div class="col-sm">
                  <input type="text" id="${item._id}-item-name" class="form-control" placeholder="Item Name";
                </div>
                <div class="col-sm">
                  <input type="text" id="${item._id}-item-type" class="form-control" placeholder="Item Type";
                </div>
              </div>
              <button id="${item._id}-new-item" onclick="DOMManager.addRoom('${item._id}')" class="btn btn-dark form-control">Add New Item</button>
            </div>
          </div>
        </div><br>`
      );
      for (let item of item.types) {
        $(`#${item._id}`).find('.card-body').append(
          `<p>
            <span id="name-${item._id}" class="text-strong"> ${item.name}</strong></span>
            <span id="name-${item._id}" class="text-strong"> ${item.type}</strong></span>
            <button class="btn btn-danger" onclick="DOMManager.deleteItem('${item._id}', '${type,_id}')"> Delete Item</button>`
        );
      }
    }
  }

}

$('create-new-item').on('click', () => {
  DOMManager.createItem($('#new-item-name'));
  $('#new-item-name').val('');
});

DOMManager.getAllHouses();