viewModel.get("button31re") &&
  viewModel.get("button31re").on("click", function (data) {
    // 现存量查询--单击
    // 获取选中行的行号
    var line = data.index;
    // 获取选中行数据信息
    var productId = viewModel.getGridModel().getRow(line).productId;
    // 传递给被打开页面的数据信息
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "f51f5a70", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        // 传参
        productId: productId
      }
    };
    // 打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.get("salesOrgId_name") &&
  viewModel.get("salesOrgId_name").on("afterValueChange", function (data) {
    // 销售组织--值改变后
    //原:var currrentParams=data.params.value;
    var currrentParams = data.value;
    if (currrentParams == null) return;
    cb.rest.invokeFunction("GT3949AT190.openApi.salesDelegate1", { params: currrentParams }, function (err, res) {
      // 根据返回结果设置
      if (res.salesDelegateDefaultData !== undefined) {
        viewModel.clearCache("salesDelegate");
        viewModel.setCache("salesDelegate", res.salesDelegateDefaultData);
        var gridModel = viewModel.getGridModel();
        gridModel.setColumnValue("stockOrgId_name", res.salesDelegateDefaultData.inventory_org_name);
        gridModel.setColumnValue("stockOrgId", res.salesDelegateDefaultData.inventory_org);
      }
    });
  });
//增行后事件
viewModel.on("customInit", function (data) {
  // 销售订单app详情--页面初始化
  viewModel.on("afterAddRow", function (param) {
    let defaultSales = viewModel.getCache("salesDelegate");
    let gridModel = viewModel.getGridModel();
    gridModel.setCellValue(param.data.index, "stockOrgId_name", defaultSales.inventory_org_name);
    gridModel.setCellvalue(param.data.index, "stockOrgId", defaultSales.inventory_org);
  });
  //模块化过滤
  var girdModel = viewModel.getGridModel();
  // 获取
  viewModel.get("agentId_name").on("beforeBrowse", function () {
    // 获取当前编辑行的品牌字段值
    const value = viewModel.get("salesOrgId").getValue();
    // 实现品牌的过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "merchantApplyRanges.orgId",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
});