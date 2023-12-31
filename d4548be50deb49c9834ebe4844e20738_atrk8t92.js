viewModel.on("customInit", function (data) {
  // 保存前事件
  viewModel.on("beforeSave", function (args) {
    let returnPromise = new cb.promise();
    cb.rest.invokeFunction("SCMSA.backDesignerFunction.queryOrderStatus", {}, function (err, res) {
      if (err) {
        cb.utils.alert("订单状态查询失败", "error");
        return false;
      } else if (res.result[0].orderSale == "N") {
        cb.utils.alert("订单暂停，不允许新增订单", "error");
        return false;
      }
      returnPromise.resolve();
    });
    return returnPromise;
  });
});