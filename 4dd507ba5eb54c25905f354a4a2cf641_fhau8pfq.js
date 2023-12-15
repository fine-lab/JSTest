viewModel.on("customInit", function (data) {
  // 印章使用申请--页面初始化
});
viewModel.on("beforeAdd", function (args) {
  var returnPromise = new cb.promise(); //同步
  cb.utils.confirm(
    "确定要新增吗？",
    function () {
      //默认异步
      return returnPromise.resolve();
    },
    function (args) {
      returnPromise.reject();
    }
  );
  return returnPromise;
});