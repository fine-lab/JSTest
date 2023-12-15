viewModel.on("customInit", function (data) {
  // 下推阻断--页面初始化
});
viewModel.on("afterLoadData", function (data) {});
viewModel.on("beforeBatchpush", function (data) {
  let errorMsg = "";
  const promises = [];
  console.log("----------------------------");
  console.log(data);
  if (data.args.cSvcUrl.indexOf("targetBillNo=ybb0789e4a") > 0) {
    alert("123");
    errorMsg = "123";
  }
  var promise = new cb.promise();
  Promise.all(promises).then(() => {
    if (errorMsg.length > 0) {
      cb.utils.alert(errorMsg, "error");
      return false;
    } else {
      promise.resolve();
    }
  });
  return promise;
});