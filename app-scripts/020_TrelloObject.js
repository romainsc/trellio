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
      if (object_dict["desc"] != "") {
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
  id: {
    value: "",
    enumerable: true,
    configurable: false,
    writable: true
  },
  name: {
    value: "",
    enumerable: true,
    configurable: false,
    writable: true
  },
  description: {
    value: "",
    enumerable: true,
    configurable: false,
    writable: true
  }
});
TrelloObject.prototype.constructor = TrelloObject;
