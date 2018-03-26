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
  _board_id: {
    value: "",
    enumerable: true,
    configurable: false,
    writable: true
  },
  board_id: {
    enumerable: true,
    configurable: false,
    set: function(board_id) {
      if(this._board_id != board_id) {
        this._board_id = board_id;
        this._dirty = true;
      };
    },
    get: function() {
      return this._board_id;
    }
  },
  same_as: {
    value: function(obj) {
      var same =  TrelloObject.prototype.same_as.call(this, obj);
      same = same && this.board_id == obj.board_id;
      return same;
    },
    enumerable: true,
    configurable: false,
    writable: false
  }
});
TrelloBoardedObject.prototype.constructor = TrelloBoardedObject;