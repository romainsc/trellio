function get_config(key) {
  var col = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config").getRange("B3:B6").getValues();
  var config_dict = {};
  config_dict["app_key"] = col[0][0].toString().trim();
  config_dict["token"] = col[1][0].toString().trim();
  config_dict["existing_board"] = col[2][0].toString().trim() == "true";
  config_dict["board_name_or_id"] = col[3][0].toString().trim();
  return config_dict[key];
}
