function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  headobj.appendChild(style);
  style.sheet.insertRule(params, 0);
}
loadStyle('.public_fixedDataTableRow_highlight-red [role="gridcell"] {background-color:red;}');
viewModel.getGridModel().on("afterSetDataSource", () => {
  //修改单元格字体颜色
  //前两个参数分别为行号和字段编码
  //修改单元格背景色
  //修改某列颜色
  gridModel.setColumnState("Authority", "style", { backgroundColor: "red" });
  //修改某行颜色
});