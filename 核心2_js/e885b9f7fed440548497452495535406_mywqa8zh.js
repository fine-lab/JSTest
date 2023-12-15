viewModel.on("beforeSave", function (args) {
  //说明：确认框提示信息
  //入参：参数1为错误提示内容； 参数2为点击确认后的回调函数； 参数3为点击取消后的回调函数
  //例：
  var returnPromise = new cb.promise();
  cb.utils.confirm(
    "客户商品编码+客户商品sku编码重复对照，是否继续？",
    function () {
      return returnPromise.resolve();
    },
    function () {
      returnPromise.reject();
    }
  );
  debugger;
  return returnPromise;
});