viewModel.on("customInit", function (data) {
  let delFunc = (e) => {
    console.log("列表参数: ", e);
    if (e.params.cCommand.indexOf("Unsubmit") < 0 && e.params.cCommand.indexOf("Unaudit") < 0) {
      return true;
    }
    let bills = JSON.parse(e.data.data);
    let bipIds = bills.map((item) => item.id).join(",");
    let result = cb.rest.invokeFunction("RBSM.backOpenApiFunction.deleteNCCSKBill", { bipIds }, function (err, res) {}, viewModel, { async: false });
    let resObj = result.result && result.result.data ? result.result.data : result.error;
    if (!resObj.success) {
      cb.utils.alert("删除NCC付款单失败！" + resObj.message, "error");
      return false;
    }
    return true;
  };
  // 通用申请单--页面初始化
  viewModel.on("beforeBatchunaudit", delFunc);
  viewModel.on("beforeBatchdo", delFunc);
});