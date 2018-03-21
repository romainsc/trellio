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
  var row_by_id = {};
  var last_row=1;

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
    var card;
    
    current_list = board.get_or_create_list(list_name);
    if (card_id != "") {
      card = current_list.get_card(card_id); // Limitation: unable to move a card to another list.
      if(card == null) {
        card = trello.get_card(card_id); // Limitation: moving a card create a clone from the spreadsheet version.
      };
      row_by_id[card_id] = j+1;
    } else {
      card = new TrelloCard();
      current_list.append_card(card);
    };
    card.name = card_name;
    card.description = card_description;
    
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
    last_row = j+1;
  };
  board = trello.update_board(board);
  
  
  for(i in board.lists) {
    current_list = board.lists[i];
    for(j in current_list.cards) {
      card = current_list.cards[j];
      if (!(card.id in row_by_id)) {
        row_by_id[card.id] = last_row+1;
        last_row = last_row+1;
      };
      update_card_row(sheet, row_by_id[card.id], current_list.name, card);
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
