function TrelloListedObject(object_dict) {
  TrelloBoardedObject.call(this, object_dict);
}
TrelloListedObject.prototype = Object.create(TrelloBoardedObject.prototype, {
  update: {
    value: function(object_dict) {
      TrelloBoardedObject.prototype.update.call(this, object_dict);
      this.list_id = object_dict["idList"];
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_common_payload: {
    value: function() {
      var payload = TrelloBoardedObject.prototype.get_common_payload.call(this);
      if (this.list_id != "") {
        payload["idList"] = this.list_id;
      };
      return payload;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  list_id: {
    value: "",
    enumerable: true,
    configurable: false,
    writable: true
  }
});
TrelloListedObject.prototype.constructor = TrelloListedObject;