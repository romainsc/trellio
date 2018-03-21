function display_boards() {
  var trello = new Trello();
  var html_value = trello.get_boards_html_list();
  SpreadsheetApp.getUi().showModalDialog(html_value, 'Available Boards');

}

function upload() {
  var str = uploader();
  var html_value = HtmlService.createHtmlOutput(str);
  SpreadsheetApp.getUi().showModalDialog(html_value, 'Available Boards');

}