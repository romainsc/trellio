function TrelloLabel(list_dict) {
  TrelloBoardedObject.call(this, list_dict);
};

TrelloLabel.prototype = Object.create(TrelloBoardedObject.prototype, {
  update: {
    value: function(object_dict) {
      TrelloBoardedObject.prototype.update.call(this, object_dict);
      this.color = object_dict["color"];
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_common_payload: {
    value: function() {
      var payload = TrelloBoardedObject.prototype.get_common_payload.call(this);
      payload["color"] = this.color;
      return payload;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _color: {
    value: "",
    enumerable: true,
    configurable: true,
    writable: true
  },
  color: {
    enumerable: true,
    configurable: true,
    set: function(color) {
      if(this._color != color) {
        this._color = color;
        this._ = true;
      };
    },
    get: function() {
      return this._color;
    }
  }
});
TrelloLabel.prototype.constructor = TrelloLabel;