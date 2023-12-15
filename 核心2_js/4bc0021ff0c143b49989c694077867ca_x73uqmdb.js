function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  headobj.appendChild(style);
  style.sheet.insertRule(params, 0);
}
viewModel.getGridModel().on("afterSetDataSource", () => {
  var gridModel = viewModel.getGridModel();
  //  设置表格xx列的单元格渲染内容
  gridModel.setColumnState("item50jg", "formatter", (rowInfo, rowData) => {
    console.log(rowInfo, rowData);
    // 显示图片
    return {
      override: true,
      html: `<img src="https://www.example.com/"  alt="自定义图片" />`
    };
  });
  loadStyle(".fixedDataTableCellLayout_wrap3 .public_fixedDataTableCell_cellContent .textCol img {width:100px !important}");
});