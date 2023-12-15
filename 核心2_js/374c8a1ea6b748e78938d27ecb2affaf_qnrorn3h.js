viewModel.on("afterLoadData", function (args) {
});
viewModel.on("afterTabActiveKeyChange", function (info) {
  debugger;
  if (info.key == "tabpane10zc") {
    ShowTab("tabpane42pj", "tabpane26zi");
  } else if (info.key == "tabpane15lb") {
    ShowTab("tabpane26zi", "tabpane42pj");
  }
});
function ShowTab(tabcode, tabcode2) {
  viewModel.execute("updateViewMeta", {
    code: tabcode, // 容器的编码（从UI设计器属性栏查看）
    visible: false
  });
  viewModel.execute("updateViewMeta", {
    code: tabcode2, // 容器的编码（从UI设计器属性栏查看）
    visible: true
  });
}