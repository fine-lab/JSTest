viewModel.on("afterLoadData", function (data) {
  // 董事长寄语--页面初始化
  // 隐藏表单页面的详情字段
  setTimeout(function () {
    document.querySelector(".col-float.label-control.multi-line").style.opacity = 0;
  }, 100);
  viewModel.get("list_name").setVisible(false);
});
viewModel.on("modeChange", function (data) {
  debugger;
  if (data == "edit") {
    setTimeout(function () {
      viewModel.get("list_name").setVisible(true);
    }, 100);
  }
});