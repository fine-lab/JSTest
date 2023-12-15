viewModel.on("beforeSubmit", function () {
  //事件发生之前，可以进行特色化处理，以此为例，可以进行保存之前数据校验，通过return true;否则return false;
  debugger;
  var viewModel = this;
  let result = cb.rest.invokeFunction("GT89699AT3.backOpenApiFunction.Test0001", {}, function (err, res) {}, viewModel, { async: false });
  var resultData = result.result;
  var id = resultData.res1[0].id;
  var a1 = viewModel.get("HT001").getValue();
  if (id != null && a1 != null && id != a1) {
    return false;
  }
});
viewModel.on("customInit", function (data) {
  // 用印申请单--页面初始化
});
viewModel.get("HT001_name") &&
  viewModel.get("HT001_name").on("afterMount", function (data) {
    // 申请人--参照加载完成后
  });