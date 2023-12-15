viewModel.on("customInit", function (data) {
  // 医药客户证照档案列表--页面初始化
  let gridModel = viewModel.getGridModel();
  viewModel.get("button16ac").on("click", function (data) {
    let id = data.id4ActionAuth;
    let billData = {
      billtype: "VoucherList",
      billno: "gspSelectOrgPop",
      params: {
        mode: "add",
        customer: gridModel.getRows()[data.index].customer,
        //这里distributionType只能为：material，customer，supplier
        distributionType: "customer",
        relationId: id
      }
    };
    cb.loader.runCommandLine("bill", billData, viewModel);
  });
});
viewModel.get("button17ad") &&
  viewModel.get("button17ad").on("click", function (data) {
    // 编辑--单击
  });