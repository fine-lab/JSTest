viewModel.on("customInit", function (data) {
  //外包资源看板(无权限限制)--页面初始化
});
viewModel.get("button25gg") &&
  viewModel.get("button25gg").on("click", function (data) {
    //按钮--单击
    debugger;
    let part_contract_code = viewModel.get("part_contract_code").getValue();
    if (!part_contract_code || part_contract_code.length == 0) {
      return;
    }
    let param = {
      contract_code: part_contract_code,
      begin_ts: "2023-01-01",
      end_ts: "2066-01-01",
      page: 0,
      size: 100
    };
    cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.updateTempData", param, function (err, res) {
      debugger;
    });
  });