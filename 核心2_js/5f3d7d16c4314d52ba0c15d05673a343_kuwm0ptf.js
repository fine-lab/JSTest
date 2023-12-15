r;
viewModel.get("sorg_name") &&
  viewModel.get("sorg_name").on("afterValueChange", function (data) {
    // 销售组织--值改变后
    var currrentParams = data.value;
    if (currrentParams === null) return;
    cb.rest.invokeFunction("GT3903AT187.backOpenApiFunction.selesDelegateApi", { params: currrentParams }, function (err, res) {
      //根据返回结果设置
      if (res.salesDelegateDefaultData !== undefined) {
        viewModel.clearCache("salesDelegate");
        viewModel.setCache("saleDelegate", res.salesDelegateDefaultData);
        var gridModel = viewModel.getGridModel();
        gridModel.setColumnValue("inventoryorg_name", res.salesDelegateDefaultData.inventory_org_name);
        gridModel.setColumnValue("inventoryorg", res.salesDelegateDefaultData.inventory_org);
      }
    });
  });
viewModel.on("afterAddRow", function (params) {
  let defaultSales = viewModel.getCache("saleDelegate");
  let gridModel = viewModel.getGridModel();
  gridModel.setCellValue(params.data.index, "inventoryorg_name", defaultSales.inventory_org_name);
  gridModel.setCellValue(params.data.index, "inventoryorg", defaultSales.inventory_org);
});
viewModel.on("customInit", function (data) {
  // 销售订单详情--页面初始化
  // 检索之前进行条件过滤
  var girdModel = viewModel.getGridModel();
  // 获取
  viewModel.get("Merchant_name").on("beforeBrowse", function () {
    // 获取当前编辑行的品牌字段值
    const value = viewModel.get("sorg").getValue();
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
viewModel.get("button31fg") &&
  viewModel.get("button31fg").on("click", function (data) {
    // 现存量查询--单击
    //获取选中行的行号
    var line = data.index;
    //获取选中行数据信息
    var shoujixinghao = viewModel.getGridModel().getRow(line).productId;
    //传递给被打开页面的数据信息
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "d22b4f1e", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        shoujixinghao: shoujixinghao
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });