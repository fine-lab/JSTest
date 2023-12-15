viewModel.on("customInit", function (data) {
  // 医药供应商证照档案列表--页面初始化
  let gridModel = viewModel.getGridModel();
  viewModel.get("button19pg").on("click", function (data) {
    let id = data.id4ActionAuth;
    let billData = {
      billtype: "VoucherList",
      billno: "gspSelectOrgPop",
      params: {
        mode: "add",
        supplier: gridModel.getRows()[data.index].supplier,
        //这里distributionType只能为：material，customer，supplier
        distributionType: "supplier",
        relationId: id
      }
    };
    cb.loader.runCommandLine("bill", billData, viewModel);
  });
});