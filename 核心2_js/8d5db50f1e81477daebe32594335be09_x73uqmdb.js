let mode = viewModel.getParams().mode;
viewModel.on("afterLoadData", function (data) {
  // 导入计算详情--页面初始化
  debugger;
  if (mode == "add") {
    viewModel.get("dawenben").setValue("1、多个少的后果搞活。\n2、大会高化奥噶的功能。\n3、的嘎达嘎达噶后");
  }
  if (mode == "browse") {
    document.querySelector(".textAreaValue pre").style.whiteSpace = "pre-wrap";
  }
});
viewModel.on("customInit", function (data) {
  // 导入计算详情--页面初始化
});