viewModel.get("saleOrgid_name") &&
  viewModel.get("saleOrgid_name").on("afterValueChange", function (data) {
    // 销售组织--值改变后
    //获取当前的Value的值
    debugger;
    var currrentParams = data.value;
    if (currrentParams === null) return;
    cb.rest.invokeFunction(
      "GT4984AT22.selesDelegateApi.selesDelegatApi",
      { params: currrentParams },
      function (err, res) {
        //根据返回结果设置
        if (res.salesDelegateDefaultData !== undefined) {
          viewModel.clearCache("salesDelegate");
          viewModel.setCache("saleDelegate", res.salesDelegateDefaultData);
          var gridModel = viewModel.getGridModel();
          gridModel.setColumnValue("inventoryorg_name", res.salesDelegateDefaultData.inventory_org_name);
          gridModel.setColumnValue("inventoryorg", res.salesDelegateDefaultData.inventory_org);
        } else {
          var xsname = data.value.name;
          var nameid = data.value.id;
          var gridModel = viewModel.getGridModel();
          gridModel.setColumnValue("stockOrgid_name", xsname);
          gridModel.setColumnValue("stockOrgid", nameid);
        }
      }
    );
  });
//页面初始化后
viewModel.on("afterAddRow", function (params) {
  debugger;
  let defaultSales = viewModel.getCache("saleDelegate");
  if (defaultSales == undefined) {
    var xsname = viewModel.get("saleOrgid_name").getValue();
    var nameid = viewModel.get("saleOrgid").getValue();
    var gridModel = viewModel.getGridModel();
    gridModel.setColumnValue("stockOrgid_name", xsname);
    gridModel.setColumnValue("stockOrgid", nameid);
  } else {
    let gridModel = viewModel.getGridModel();
    gridModel.setCellValue(params.data.index, "stockOrgid_name", defaultSales.inventory_org_name);
    gridModel.setCellValue(params.data.index, "stockOrgid", defaultSales.inventory_org);
  }
});
viewModel.on("customInit", function (data) {
  // 销售订单详情--页面初始化
  // 检索之前进行条件过滤
  var girdModel = viewModel.getGridModel();
  // 获取
  viewModel.get("Merchant_name").on("beforeBrowse", function () {
    // 获取当前编辑行的品牌字段值
    const value = viewModel.get("saleOrgid").getValue();
    // 实现过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "merchantApplyRanges.orgId",
      op: "eq",
      value1: value
    });
    //设置参照
    this.setFilter(condition);
  });
});
viewModel.get("button33le") &&
  viewModel.get("button33le").on("click", function (data) {
    // 现存量查询--单击
    //获取选中行的行号
    var line = data.index;
    //获取选中行数据信息
    var productId = viewModel.getGridModel().getRow(line).productid;
    //传递给被打开页面的数据信息
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "0b577474", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //给弹框传参数
        productId: productId
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });