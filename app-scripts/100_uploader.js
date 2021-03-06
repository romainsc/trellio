function uploader() {
  var con = get_config("existing_board");
  var new_board = !get_config("existing_board");
  var board_name_or_id = get_config("board_name_or_id");
  var report_str = "";
  var trello = new Trello();
  var board;
  if (new_board) {
    board = upload_new_board(trello, board_name_or_id);
  } else {
    board = trello.get_board(board_name_or_id);
  }
  update_existing_board(trello, board);
  report_str = 'Board '+board.get_anchored_name()+' created/updated, id: '+board.id;
  return report_str;
}

function upload_new_board(trello, board_name) {
  var board = new TrelloBoard();
  
  board.name = board_name;
  return trello.create_board(board);
};

function update_existing_board(trello, board) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("cards");
  var lists = {};
  var rows=sheet.getDataRange().getValues();
  var current_list = null;
  var cards_in_row = [];

  for (j=1;j<rows.length;j++) {
    var list_name = rows[j][0];
    var card_id = rows[j][1];
    var card_name = rows[j][2];
    var card_description = rows[j][3];
    var label_colors = ['yellow', 'purple', 'blue', 'red',
                        'green', 'orange', 'black', 'sky',
                        'pink', 'lime', 'null'];
    var i=4;
    var labels_string;
    var labels_name;
    var label;
    var card = null;
    var existing_card = false;
    var card_row_index = 0;
    
    current_list = board.get_or_create_list(list_name);
    
    if (card_id != "") {
      card = current_list.get_card(card_id); 
      if(card == null) {
        board.move_card(card_id, current_list);
      };
    } else {
      if (card_name != "") {
        card = new TrelloCard();
        current_list.append_card(card);
      };
    };
    if (card != null) {
      cards_in_row.push(card);
      card.name = card_name;
      card.description = card_description;
    };
    
    var labels = {};
    for (var color_index in label_colors) { 
      labels_string = rows[j][i];
      if(labels_string != "") {
        labels_name = labels_string.split(',');
        for(var label_name_index in labels_name) {
          label = card.get_or_create_label(labels_name[label_name_index]);
          label.color = label_colors[color_index];
          labels[labels_name[label_name_index]] = label;
        };
        card.labels = labels;
      };
      i = i+1;
    };
  };
  board = trello.update_board(board);
  
  for(i in board.lists) {
    current_list = board.lists[i];
    for(j in current_list.cards) {
      card = current_list.cards[j];
      existing_card = false;
      for(var row=0; row < cards_in_row.length; row++) {
        if(cards_in_row[row].id == card.id) {
          existing_card = true ;
          card_row_index = row;
        };
      };
      if (!existing_card) {
        cards_in_row.push(card);
        card_row_index = cards_in_row.length;
      }
      update_card_row(sheet, card_row_index+2, current_list.name, card);
    };
  };
};

function label_colors(labels)
{
  var labels_by_color = {'yellow':[], 'purple':[], 'blue':[], 'red':[],
                         'green':[], 'orange':[], 'black':[], 'sky':[],
                         'pink':[], 'lime':[], 'null':[]};
  var label_colors = ['yellow', 'purple', 'blue', 'red',
                      'green', 'orange', 'black', 'sky',
                      'pink', 'lime', 'null'];
  var label;
  var columns = [];
  
  for(var label_name in labels) {
    label = labels[label_name];
    labels_by_color[label.color].push(label_name);
  };
  for(var color in label_colors) {
    columns.push(labels_by_color[label_colors[color]].join(","));
  };
  return columns;
};

function update_card_row(sheet, row, list_name, card) {
  var card_row = [list_name, card.id, card.name, card.description];
  
  card_row = card_row.concat(label_colors(card.labels));
  var range = sheet.getRange(row,1,1,15);
  range.setValues([card_row]);
};
