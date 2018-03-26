function Trello(app_key, token) {
  TrelloRest.call(this,app_key, token);
};
Trello.prototype = Object.create(TrelloRest.prototype, {
  _get_objects_array: {
    value: function(from_dict_constructor, rel_path) {
      var values=this._trello_get(rel_path);
      var objects_array=new Array();
      for (var i=0; i < values.length; i++) {
        objects_array.push(from_dict_constructor.call(this, values[i]));
      }
      return objects_array;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _get_board_meta_only_from_dict: {
    value: function(board_dict) {
      var board;
      board = new TrelloBoard(board_dict);
      return board;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _get_label_from_dict: {
    value: function(label_dict) {
      return new TrelloLabel(label_dict);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _get_board_from_dict: {
    value: function(board_dict) {
      var board = this._get_board_meta_only_from_dict(board_dict);
      board.update_lists(this.get_lists(board.id));
      return board;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _get_card_from_dict: {
    value: function(card_dict) {
      var card;
      card = new TrelloCard(card_dict);
      return board;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _get_lists_from_dict: {
    value: function(list_dict) {
      var list;
      list = new TrelloList(list_dict);
      list.update_cards(this.get_cards_in_list(list.id));
      return list;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _get_card_from_dict: {
    value: function(card_dict) {
      return new TrelloCard(card_dict);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_boards: {
    value: function() {
      return this._get_objects_array(this._get_board_from_dict,"members/me/boards");
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_boards_meta_only: {
    value: function() {
      return this._get_objects_array(this._get_board_meta_only_from_dict,"members/me/boards");
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_lists: {
    value: function(board_id) {
      return this._get_objects_array(this._get_lists_from_dict,"boards/"+board_id+"/lists");
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_cards_in_list: {
    value: function(list_id) {
      return this._get_objects_array(this._get_card_from_dict,"lists/"+list_id+"/cards");
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_board: {
    value: function(board_id) {
      var board_dict=this._trello_get("boards/"+board_id);
      return this._get_board_from_dict(board_dict);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_board_labels: {
    value: function(board_id) {
      return this._get_objects_array(this._get_label_from_dict,"boards/"+board_id+"/labels");
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_card: {
    value: function(card_id) {
      var card_dict=this._trello_get("cards/"+card_id);
      return this._get_card_from_dict(card_dict);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_boards_html_list: {
    value: function() {
      var boards = this.get_boards_meta_only();
      var headers = ["Board Name", "Board ID"];
      var board_entries = new Array();
      for (var i in boards) {
        var board_entry = new Array();
        board_entry.push(boards[i].get_anchored_name());
        board_entry.push(boards[i].id);
        board_entries.push(board_entry);
      };
      return html_table(headers, board_entries);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  create_object: {
    value: function(rel_path, object) {
      var object_dict = this._trello_post(rel_path, object.get_create_post_payload());
      object.update(object_dict);
      return object;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  update_object: {
    value: function(rel_path, object) {
      if(object.is_dirty()) {
        var object_dict = this._trello_put(rel_path, object.get_update_put_payload());
        object.update(object_dict);
      };
      return object;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  create_board: {
    value: function(board) {
      return this.create_object("boards", board);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  create_list: {
    value: function(list) {
      list = this.create_object("lists", list);
      list.update_cards(list.cards);
      return list;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  create_label: {
    value: function(label) {
      return this.create_object("labels", label);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  create_card: {
    value: function(card) {
      card.labels = this.sync_labels(card);      
      return this.create_object("cards", card);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  update_board: {
    value: function(board) {
      this.update_object("boards/"+board.id, board);
      var current_list;
      
      for(var list_name in board.lists) {
        current_list = board.lists[list_name];
        if(current_list.id == "") {
          current_list = this.create_list(current_list);
        }
        current_list = this.update_list(current_list);
        board.lists[list_name] = current_list;
      };
      return board;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  update_list: {
    value: function(list) {
      this.update_object("lists/"+list.id, list);
      var current_card;
      var labels;
      
      for(var i in list.cards) {
        current_card = list.cards[i];
        if(current_card.id == "") {
          current_card = this.create_card(current_card);
        } else {
          current_card = this.update_card(current_card);
        };
        list.cards[i] = current_card;
      };
      return list;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  
  sync_labels: {
    value: function(card) {
      var labels = card.labels;
      var current_label;
      var existing_board_labels;
      var current_is_existing_label;
      for(var label_name in labels) {
        current_label = labels[label_name];
        current_is_existing_label = true;
        if (current_label.id == "") {
          if (card.board_id == "") {
            throw "Unknow board";
          }
          existing_board_labels = this.get_board_labels(card.board_id);
          current_is_existing_label = false;
          for(var i in existing_board_labels) {
            if(existing_board_labels[i].name == current_label.name) {
              current_is_existing_label = true;
              current_label = existing_board_labels[i];
            };
          };
          if(!current_is_existing_label) {
            current_label = this.create_label(current_label);
          };
        } else {
          current_label = this.update_label(current_label);
        };
        labels[label_name] = current_label;
      };
      return labels;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },  
  update_card: {
    value: function(card) {
      card.labels = this.sync_labels(card);
      return this.update_object("cards/"+card.id, card);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  update_label: {
    value: function(label) {
      return this.update_object("labels/"+label.id, label);
    },
    enumerable: true,
    configurable: false,
    writable: false
  }
});
Trello.prototype.constructor = Trello;

