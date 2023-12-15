viewModel.on("customInit", function (data) {
  // 发票申请--页面初始化
});
viewModel.on("beforeSubmit", function () {
  //事件发生之前，可以进行特色化处理，以此为例，可以进行保存之前数据校验，通过return true;否则return false;
  debugger;
  var viewModel = this;
  let result = cb.rest.invokeFunction("GT89699AT3.backOpenApiFunction.Test0001", {}, function (err, res) {}, viewModel, { async: false });
  var resultData = result.result;
  var id = resultData.res1[0].id;
  var a1 = viewModel.get("applier").getValue();
  if (id != null && a1 != null && id != a1) {
    return false;
  }
});