function onOpen(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menu_entries = [{name: "Display Available Boards", functionName: "display_boards"},{name: "Synchronize cards from “cards” sheet", functionName: "upload"}];
  ss.addMenu("Trello", menu_entries);
 }
