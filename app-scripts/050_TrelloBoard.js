function TrelloBoard(board_dict) {
  TrelloObject.call(this, board_dict);
  this.lists = {};
};

TrelloBoard.prototype = Object.create(TrelloObject.prototype, {
  update: {
    value: function(board_dict) {
      TrelloObject.prototype.update.call(this, board_dict);
      this.url = board_dict["url"];
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_create_post_payload: {
    value: function() {
      var payload = TrelloObject.prototype.get_create_post_payload.call(this);
      payload["defaultLists"] = false;
      payload["defaultLabels"] = false;
      return payload;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  update_lists: {
    value: function(lists) {
      this.lists = {};
      for (var i in lists) {
        this.lists[lists[i].name] = lists[i];
        this.lists[lists[i].name].board_id = this.id;
      }
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_or_create_list: {
    value: function(list_name) {
      var list;
      if (list_name in this.lists) {
        list = this.lists[list_name];
      } else {
        list = new TrelloList();
        list.board_id = this.id;
        list.name = list_name;
        this.lists[list_name] = list;
      };
      return list;
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
  _lists: {
    value: null,
    enumerable: true,
    configurable: true,
    writable: true
  },
  labels: {
    enumerable: true,
    configurable: true,
    set: function(labels) {
      if(labels.length == this._labels.length) {
        for(var i=0; i<labels.length && !this._dirty; i++) {
          for(var j=0; j<this._labels.length && !this._dirty; j++) {
            if(!labels[i].same_as(this._labels[j])) {
              this._dirty = true;
            };
          };
        };
      } else {
        this._dirty = true;
      };
      if(this._dirty) {
        this._labels = labels;
      };
    },
    get: function() {
      return this._labels;
    }
  },
  lists: {
    enumerable: true,
    configurable: true,
    set: function(lists) {
      if(lists.length == this._lists.length) {
        for(var i=0; i<lists.length && !this._dirty; i++) {
          for(var j=0; j<this._lists.length && !this._dirty; j++) {
            if(!lists[i].same_as(this._lists[j])) {
              this._dirty = true;
            };
          };
        };
      } else {
        this._dirty = true;
      };
      if(this._dirty) {
        this._lists = lists;
      };
    },
    get: function() {
      return this._lists;
    }
  },
  url: {
    value: null,
    enumerable: true,
    configurable: true,
    writable: true
  },
  get_anchored_name: {
    value: function() {
      return '<a target="_blank" href="'+this.url+'">'+this.name+'</a>';
    },
    enumerable: true,
    configurable: false,
    writable: false
  }
});
TrelloBoard.prototype.constructor = TrelloBoard;