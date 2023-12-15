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
  let gridModel = viewModel.getGridModel();
  //前两个参数分别为行号和字段编码
  //修改单元格背景色
  //修改某列颜色
  gridModel.setColumnState("Category", "style", { backgroundColor: "red" });
  //修改某行颜色
});
let gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", () => {
  debugger;
  let res = cb.rest.invokeFunction("AT15CA40940830000A.frontCustomFunction.testsum", {}, function (err, res) {}, viewModel, { async: false });
  document.querySelector("#\\32 000078273 > span > span").innerText = res.result.res[0][1];
});
viewModel.on("afterMount", function (args) {
  debugger;
  get("button28ef").setState("cShowCaption", "test");
});