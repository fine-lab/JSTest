viewModel.on("customInit", function (data) {
  // 供应商档案--页面初始化
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (currentState == "add") {
      //新增状态
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "营业执照", qualifyDefine: 1, qualifydoc: 1, longEffective: false, qualifydoc_description: "营业执照" });
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "银行开户许可证", qualifyDefine: 1, qualifydoc: 6, longEffective: false, qualifydoc_description: "银行开户许可证" });
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "社会责任", qualifyDefine: 1, qualifydoc: 18, longEffective: false, qualifydoc_description: "供应商社会责任承诺书" });
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "注册人授权委托书", qualifyDefine: 1, qualifydoc: 9, longEffective: false, qualifydoc_description: "采购云平台注册人授权委托书" });
      viewModel.get("vendorQualifies").appendRow({ qualifydoc_name: "廉洁自律承诺书", qualifyDefine: 1, qualifydoc: 507, longEffective: false, qualifydoc_description: "阳光合作承诺书" });
    }
  });
  viewModel.get("vendorQualifies") &&
    viewModel.get("vendorQualifies").on("beforeDeleteRows", function (args) {
      debugger;
      var index = viewModel.get("vendorQualifies").getFocusedRowIndex();
      if (index < 5) {
        cb.utils.alert("系统默认资质，不能删除！");
        return false;
      }
    });
});