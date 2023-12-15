function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  headobj.appendChild(style);
  style.sheet.insertRule(params, 0);
}
viewModel.on("customInit", function (data) {
  // 我的LOGO--页面初始化
  viewModel.getGridModel().on("afterSetDataSource", () => {
    var gridModel = viewModel.getGridModel();
    loadStyle(".fixedDataTableCellLayout_wrap3 .public_fixedDataTableCell_cellContent .textCol img {width:1000px !important}");
  });
});