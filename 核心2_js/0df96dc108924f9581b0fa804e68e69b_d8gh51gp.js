viewModel.on("modeChange", function (data) {
  setTimeout(function () {
    if (data == "add" || data == "edit") {
      //新增
      viewModel.get("btnModelPreview").setVisible(false); //打印模板按钮
    } else {
      //浏览
      viewModel.get("btnModelPreview").setVisible(false); //打印模板按钮
    }
  }, 50);
});