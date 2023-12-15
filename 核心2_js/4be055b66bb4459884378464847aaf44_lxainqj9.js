viewModel.on("beforeBatchsubmit", function (data) {
  //事件发生之前，可以进行特色化处理，以此为例，可以进行保存之前数据校验，通过return true;否则return false;
  debugger;
  let result = cb.rest.invokeFunction("GT89699AT3.backOpenApiFunction.Test0001", {}, function (err, res) {}, viewModel, { async: false });
  var resultData = result.result;
  var id = resultData.res1[0].id;
  var resP = data.data;
  var resultDatas = resP.data;
  var data2 = JSON.parse(resultDatas);
  for (let j in resultDatas) {
    var resultDatas1 = data2[j];
    var a1 = resultDatas1.applier;
    if (id != null && a1 != null && id != a1) {
      return false;
    }
  }
});
viewModel.on("customInit", function (data) {
  // 用印申请单列表--页面初始化
});