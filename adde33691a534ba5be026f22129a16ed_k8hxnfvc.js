viewModel.on("customInit", function (data) {
  // 采购合同变更--页面初始化
  function confirmS(content) {
    cb.utils.confirm(
      content,
      function () {},
      function (args) {}
    );
  }
  viewModel.on("beforeSave", function (data) {
    debugger;
    let changeData = JSON.parse(data.data.data);
    let newMoney = changeData.taxMoney;
    let contractid = changeData.contractId;
    let conDetail = cb.rest.invokeFunction("ycContractManagement.interface.queryContract", { id: contractid }, function (err, res) {}, viewModel, { async: false });
    let oldMoney = conDetail.result.taxMoney;
    if (newMoney > oldMoney) {
      let checkBudgetRes = cb.rest.invokeFunction(
        "ycContractManagement.interface.checkCHBudget",
        { id: contractid, contractMaterialList: changeData.contractMaterialList },
        function (err, res) {},
        viewModel,
        { async: false }
      );
      if (checkBudgetRes && checkBudgetRes.result) {
        if (checkBudgetRes.result.status == "error") {
          confirmS("校验未通过:" + checkBudgetRes.result.errmsg);
          return false;
        }
      } else {
        confirmS("校验预算失败！");
        return false;
      }
    }
  });
});