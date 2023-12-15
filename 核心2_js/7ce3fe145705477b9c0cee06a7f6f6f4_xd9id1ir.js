viewModel.on("beforeBatchsubmit", function (args) {
  let dataArray = viewModel.getGridModel().getData();
  console.log("提交前实现信息确认=》单据列表数据：" + dataArray);
  //验证选中的单据数据的交易类型是否是 TECHFUND
  let bustypeName = "";
  if (dataArray != null && dataArray != undefined && dataArray.length > 0) {
    for (var i = 0; i < dataArray.length; i++) {
      let dataObj = dataArray[i];
      bustypeName = dataObj.bustype_name;
    }
  }
  //获取当前单据交易类型
  console.log("提交前实现信息确认=》单据交易类型：" + bustypeName);
  if (bustypeName == "TECH FUND") {
    var promise = new cb.promise();
    cb.utils.confirm(
      "经理审批后，此订单将进入采购流程无法取消，请再次确认所订物品及型号。",
      function () {
        // 点击确定
        return promise.resolve();
      },
      function () {
        // 点击取消
        promise.reject();
      }
    );
    return promise;
  }
});