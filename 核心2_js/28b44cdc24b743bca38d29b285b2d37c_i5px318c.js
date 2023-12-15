// 盈亏数量
viewModel.getGridModel().setColumnState("dsfa_marketingmaterialsinventorycard_userDefine_1686633811910066177", "formatter", function (rowInfo, rowData) {
  var qantitydecimal = 0;
  if (rowData.productMainUnit_precision != null && rowData.productMainUnit_precision != undefined) {
    qantitydecimal = rowData.productMainUnit_precision;
  }
  var lunationQuantity = parseFloat(rowData.dsfa_marketingmaterialsinventorycard_userDefine_1686633811910066177).toFixed(qantitydecimal);
  var className = "";
  if (lunationQuantity == 0 || lunationQuantity == "NaN") {
    lunationQuantity = (0).toFixed(qantitydecimal);
    className = "URL normal-black";
  } else if (lunationQuantity > 0) {
    className = "URL overage-green";
  } else {
    className = "URL loss-red";
  }
  return {
    override: true,
    html: '<span class="' + className + '">' + lunationQuantity + "</span>",
    text: lunationQuantity
  };
});