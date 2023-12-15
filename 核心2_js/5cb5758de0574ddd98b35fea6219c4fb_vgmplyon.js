function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
    .comm {color: #fff; border-radius: 4px; position: relative;top: 4px; text-align: center; padding: 2px 8px;}
    .confirm-tag { background: #f14747; } 
    .unconfirm-tag { background: #32c5b7;}`;
  headobj.appendChild(style);
}
viewModel.on("afterMount", () => {
  loadStyle();
});
var gridModel = viewModel.getGridModel();
gridModel.setColumnState("zhuangtai", "formatter", (rowInfo, rowData) => {
  let cls = rowData.zhuangtai.value == "1" ? "confirm-tag" : "unconfirm-tag";
  cls += " comm";
  // 显示带背景色的标签
  return {
    override: true,
    html: `<span class="${cls}">` + rowData.zhuangtai.text + `</span>`
  };
});