viewModel.on("customInit", function (data) {
  // 供应商申请--页面初始化
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (currentState == "add") {
      //新增状态
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "营业执照", qualifyDefine: 1, qualifydoc: 1, longEffective: false, qualifydoc_description: "营业执照" });
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "银行开户许可证", qualifyDefine: 1, qualifydoc: 6, longEffective: false, qualifydoc_description: "银行开户许可证" });
    }
  });
});