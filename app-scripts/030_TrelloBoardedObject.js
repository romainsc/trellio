function TrelloBoardedObject(object_dict) {
  TrelloObject.call(this, object_dict);
}
TrelloBoardedObject.prototype = Object.create(TrelloObject.prototype, {
  update: {
    value: function(object_dict) {
      TrelloObject.prototype.update.call(this, object_dict);
      this.board_id = object_dict["idBoard"];
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_common_payload: {
    value: function() {
      var payload = TrelloObject.prototype.get_common_payload.call(this);
      if (this.board_id != "") {
        payload["idBoard"] = this.board_id;
      };
      return payload;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  board_id: {
    value: "",
    enumerable: true,
    configurable: false,
    writable: true
  }
});
TrelloBoardedObject.prototype.constructor = TrelloBoardedObject;