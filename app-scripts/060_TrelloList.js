function TrelloList(list_dict) {
  TrelloBoardedObject.call(this, list_dict);
  this._cards = new Array();
};

TrelloList.prototype = Object.create(TrelloBoardedObject.prototype, {
  update: {
    value: function(object_dict) {
      TrelloBoardedObject.prototype.update.call(this, object_dict);
      this.update_cards(this.cards);
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_create_post_payload: {
    value: function() {
      var payload = TrelloBoardedObject.prototype.get_create_post_payload.call(this);
      payload["pos"] = "bottom";
      return payload;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  update_cards: {
    value: function(cards) {
      var new_cards = cards;
      for(var i in new_cards) {
        new_cards[i].list_id = this.id;
        new_cards[i].board_id = this.board_id;
      }
      this.cards = new_cards;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  append_card: {
    value: function(card) {
      card.list_id = this.id;
      card.board_id = this.board_id;
      card.update_labels();
      this._cards.push(card);
      this._dirty = true;
      return card;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  get_card: {
    value: function(card_id) {
      var card = null;
      for(var i in this._cards) {
        if(this._cards[i].id == card_id) {
          card = this._cards[i];
        };
      };
      return card;
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  _cards: {
    value: null,
    enumerable: true,
    configurable: true,
    writable: true
  },
  cards: {
    enumerable: true,
    configurable: true,
    set: function(cards) {
      if(!this.same_array(this._cards, cards)) {
         this._dirty = true;
         this._cards = cards;
      };
    },
    get: function() {
      return this._cards;
    }
  },
  same_as: {
    value: function(obj) {
      var same =  TrelloBoardedObject.prototype.same_as.call(this, obj);
      same = same && this.same_array(this._cards, obj.cards);
      return same;
    },
    enumerable: true,
    configurable: false,
    writable: false
  }
});
TrelloList.prototype.constructor = TrelloList;