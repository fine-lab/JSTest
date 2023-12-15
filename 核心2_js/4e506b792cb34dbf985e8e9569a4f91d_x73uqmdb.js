viewModel.get("upMain_staffNewList").on("beforeBrowse", function () {
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "mainJobList.dept_id",
    op: "eq",
    value1: "2764180810404096"
  });
  this.setFilter(condition);
});
const cusStyle = `.public_fixedDataTableRow_test { color: red; }`;
loadStyle(cusStyle);
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  headobj.appendChild(style);
  style.sheet.insertRule(params, 0);
}
viewModel.on("afterAddRow", (data) => {
  viewModel.getGridModel().setRowState(data.data.index, "className", "test");
  if (data.data.index > 1) {
    viewModel.getGridModel().setRowState(data.data.index - 1, "className", null);
  }
});
viewModel.get("button27ah") &&
  viewModel.get("button27ah").on("click", function (data) {
    // 按钮--单击
    viewModel.getGridModel().clear();
    viewModel.getGridModel().insertRow({ new1: "11", new2: "22" });
    viewModel.getGridModel().insertRow({ new1: "11", new2: "22" });
  });