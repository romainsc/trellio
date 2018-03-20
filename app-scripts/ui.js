function html_table(headers, values) {
  var html = "";
  html = html + "<table><tr>";
  for (var i=0;i<headers.length;i++) {
    html = html + "<th>"+headers[i]+"</th>";
  }
  html = html + "</tr>";
  for (var i=0;i<values.length;i++) {
    html = html + "<tr>";
    for (var j=0; j<headers.length;j++) {
      html = html + "<td>"+values[i][j]+"</td>";
    }
    html = html + "</tr>";
  }
  return HtmlService.createHtmlOutput(html);
}
