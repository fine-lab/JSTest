viewModel.on("customInit", function (data) {
  let delFuc = (e) => {
    let billData = JSON.parse(e.data.data);
    let result = cb.rest.invokeFunction("RBSM.backOpenApiFunction.deleteNCCSKBill", { bipIds: billData.id }, function (err, res) {}, viewModel, { async: false });
    let resObj = result.result && result.result.data ? result.result.data : result.error;
    if (!resObj.success) {
      cb.utils.alert("删除NCC付款单失败！" + resObj.message, "error");
      return false;
    }
    return true;
  };
  // 通用申请单--页面初始化
  viewModel.on("beforeUnaudit", delFuc);
  viewModel.on("beforeUnsubmit", delFuc);
});