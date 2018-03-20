function onOpen(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menu_entries = [{name: "Display Available Boards", functionName: "display_boards"},{name: "Upload cards from “cards” sheet", functionName: "upload"}];
  ss.addMenu("Trello", menu_entries);
 }
