viewModel.get("salesOrgId_name") &&
  viewModel.get("salesOrgId_name").on("afterValueChange", function (data) {
    // 销售组织--值改变后
    var currrentParams = data.value;
    if (currrentParams === null) return;
    cb.rest.invokeFunction("GT100265AT156.getnum.selesDelegatApi", { params: currrentParams }, function (err, res) {
      //根据返回结果设置
      if (res.salesDelegateDefaultData !== undefined) {
        viewModel.clearCache("salesDelegate");
        viewModel.setCache("saleDelegate", res.salesDelegateDefaultData);
        var gridModel = viewModel.getGridModel();
        gridModel.setColumnValue("stockOrgId_name", res.salesDelegateDefaultData.inventory_org_name);
        gridModel.setColumnValue("stockOrgId", res.salesDelegateDefaultData.inventory_org);
      } else {
        //获取销售组织的信息
        var xsname = data.value.name;
        var nameid = data.value.id;
        //给stockOrgId_name填值
        var gridModel = viewModel.getGridModel();
        gridModel.setColumnValue("stockOrgId_name", xsname);
        gridModel.setColumnValue("stockOrgId", nameid);
      }
    });
  });
viewModel.on("afterAddRow", function (params) {
  let defaultSales = viewModel.getCache("saleDelegate");
  if (defaultSales == undefined) {
    //获取销售组织的信息
    var xsname = viewModel.get("salesOrgId_name").getValue();
    var nameid = viewModel.get("salesOrgId").getValue();
    //给stockOrgId_name填值
    var gridModel = viewModel.getGridModel();
    gridModel.setColumnValue("stockOrgId_name", xsname);
    gridModel.setColumnValue("stockOrgId", nameid);
  } else {
    let gridModel = viewModel.getGridModel();
    gridModel.setCellValue(params.data.index, "stockOrgId_name", defaultSales.inventory_org_name);
    gridModel.setCellValue(params.data.index, "stockOrgId", defaultSales.inventory_org);
  }
});