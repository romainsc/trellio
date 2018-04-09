function TrelloBoard(board_dict) {
  TrelloObject.call(this, board_dict);
  this._lists = {};
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
  move_card: {
    value: function(card_id, dest_list) {
      var card = null;
      for (var current_list_name in this.lists) {
        if (card == null) {
          card = this.lists[current_list_name].pop_card(card_id);
        };
      };
      dest_list.append_card(card);
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
      if (list_name in this._lists) {
        list = this._lists[list_name];
      } else {
        list = new TrelloList();
        list.board_id = this.id;
        list.name = list_name;
        this._lists[list_name] = list;
        this._dirty = true;
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
      if(!this.same_array(this._labels, labels)) {
        this._dirty = true;
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
      if(!this.same_array(this._lists, lists)) {
        this._dirty = true;
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
  },
  same_as: {
    value: function(obj) {
      var same =  TrelloObject.prototype.same_as.call(this, obj);
      same = same && this.same_array(this._lists, obj.lists);
      same = same && this.same_array(this._labels, obj.labels);
      return same;
    },
    enumerable: true,
    configurable: false,
    writable: false
  }
});
TrelloBoard.prototype.constructor = TrelloBoard;