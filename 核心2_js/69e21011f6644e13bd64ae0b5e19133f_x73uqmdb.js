viewModel.get("new2") &&
  viewModel.get("new2").on("afterValueChange", function (data) {
    // 字段2--值改变后
    // 拿到new2 数值
    // 设置new1隐藏
  });
viewModel.on("customInit", function (data) {
  debugger;
  viewModel.on("afterLoadData", function () {
    var ss = viewModel.getParams();
  });
  viewModel.on("beforeSave", function (arg) {
    console.log(arg);
    viewModel.get("new4").on("onFileUploadCallBack", function (e) {
      console.log(e);
    });
  });
  viewModel.get("new4").on("onFileUploadCallBack", function (e) {
    console.log(e);
  });
});