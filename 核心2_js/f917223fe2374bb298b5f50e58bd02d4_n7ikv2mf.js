viewModel.on("customInit", function (data) {
  // 平台联系人详情--页面初始化
  viewModel.get("out_partner_prl_serviceAreaList") &&
    viewModel.get("out_partner_prl_serviceAreaList").on("afterValueChange", function (data) {
      debugger;
      var values = viewModel.get("out_partner_prl_serviceAreaList").getShowValue();
      var names = [];
      if (values && values.length > 0) {
        for (var a1 = 0; a1 < values.length; a1++) {
          names.push(values[a1].out_partner_prl_serviceAreaList);
        }
      }
      viewModel.get("serviceAreaName").setValue(names.join(","));
    });
});