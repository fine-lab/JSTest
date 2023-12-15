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
  gridModel.setColumnState("ProductAlbum", "formatter", (rowInfo, rowData) => {
    // 显示图片
    return {
      override: true,
      html: `<img src="` + rowData.ProductAlbum1 + `"  alt="" />`
    };
  });
  loadStyle(".fixedDataTableCellLayout_wrap3 .public_fixedDataTableCell_cellContent .textCol img {height:100px  !important}");
  loadStyle(".fixedDataTableCellLayout_wrap3 .public_fixedDataTableCell_cellContent .textCol img {width:200px !important}");
});