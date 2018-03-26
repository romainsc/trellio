function TrelloObject(object_dict) {
  if(object_dict != undefined) {
    this.update(object_dict);
  };
};
TrelloObject.prototype = Object.create(Object.prototype, {
  update: {
    value: function(object_dict) {
      this.id = object_dict["id"];
      this.name = object_dict["name"];
      if (object_dict["desc"]!="") {
        this.description = object_dict["desc"];
      };
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_common_payload: {
    value: function() {
      var payload = {};
      if (this.name != "") {
        payload["name"] = this.name;
      };
      if (this.description != "") {
        payload["desc"] = this.description;
      };
      return payload;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_create_post_payload: {
    value: function() {
      return this.get_common_payload();
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_update_put_payload: {
    value: function() {
      var payload = this.get_common_payload();
      if (!this.is_created()) {
        throw "Create "+this.name+" first!";
      };
      payload["id"] = this.id;
      return payload;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  is_created: {
    value: function() {
      return this.id != "";
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _id: {
    value: "",
    enumerable: true,
    configurable: false,
    writable: true
  },
  id: {
    enumerable: true,
    configurable: false,
    set: function(id) {
      if(this._id != id) {
        this._id = id;
        this._dirty = true;
      };
    },
    get: function() {
      return this._id;
    }
  },
  name: {
    enumerable: true,
    configurable: false,
    set: function(name) {
      if(this._name != name) {
        this._name = name;
        this._dirty = true;
      };
    },
    get: function() {
      return this._name;
    }
  },
  _dirty: {
    value: false,
    enumerable: true,
    configurable: false,
    writable: true
  },
  _name: {
    value: "",
    enumerable: false,
    configurable: false,
    writable: true
  },
  _description: {
    value: "",
    enumerable: true,
    configurable: false,
    writable: true
  },
  description: {
    enumerable: true,
    configurable: false,
    set: function(description) {
      if(this._description != description) {
        this._description = description;
        this._dirty = true;
      };
    },
    get: function() {
      return this._description;
    }
  },
  same_array: {
    value: function(array) {
      var same_array = true;
      if(lists.length == this._lists.length) {
        for(var i=0; i<lists.length && same_array; i++) {
          for(var j=0; j<this._lists.length && same_array; j++) {
            if(!lists[i].same_as(this._lists[j])) {
              same_array = false;
            };
          };
        };
      };
      return same_array;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  same_as: {
    value: function(obj) {
      var same = true;
      same = same && this.id == obj.id;
      same = same && this.name == obj.name;
      same = same && this.description == obj.description;
      return same;
    },
    enumerable: true,
    configurable: false,
    writable: false
  }
});
TrelloObject.prototype.constructor = TrelloObject;
