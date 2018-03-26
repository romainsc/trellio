function TrelloCard(card_dict) {
  this.labels = {};
  TrelloListedObject.call(this, card_dict);
};
TrelloCard.prototype = Object.create(TrelloListedObject.prototype, {
  update: {
    value: function(card_dict) {
      TrelloListedObject.prototype.update.call(this, card_dict);
      var labels = [];
      for(var i in card_dict["labels"]) {
        var label_dict = card_dict["labels"][i];
        labels.push(new TrelloLabel(label_dict));
      };
      this.update_labels(labels);  
      this.url = card_dict["url"];
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_common_payload: {
    value: function() {
      var payload = TrelloListedObject.prototype.get_common_payload.call(this);
      var labels_payload = "";
      for(var label_name in this.labels) {
        labels_payload = labels_payload + ","  + this.labels[label_name].id;
      };
      if (labels_payload != "") {
        payload["idLabels"] = labels_payload.slice(1);
      };
      return payload;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  update_labels: {
    value: function(labels) {
      if(labels == undefined) {
        labels = this.labels;
      };
      this.labels = {};
      for (var i in labels) {
        this.labels[labels[i].name] = labels[i];
        this.labels[labels[i].name].board_id = this.board_id;
      };
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_or_create_label: {
    value: function(label_name) {
      var label;
      if (label_name in this.labels) {
        label = this.labels[label_name];
      } else {
        label = new TrelloLabel();
        label.board_id = this.board_id;
        label.name = label_name;
        this.labels[label_name] = label;
      };
      return label;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _labels: {
    value: null,
    enumerable: true,
    configurable: true,
    writable: true
  },
  labels: {
    enumerable: true,
    configurable: true,
    set: function(labels) {
      if(!this.same_array(this._labels, labels)) {
        this._dirty = true;
        this._labels = labels;
      };
    },
    get: function() {
      return this._labels;
    }
  },
  same_as: {
    value: function(obj) {
      var same =  TrelloListedObject.prototype.same_as.call(this, obj);
      same = same && this.same_array(this._labels, obj.labels);
      return same;
    },
    enumerable: true,
    configurable: false,
    writable: false
  }
});
TrelloCard.prototype.constructor = TrelloCard;
