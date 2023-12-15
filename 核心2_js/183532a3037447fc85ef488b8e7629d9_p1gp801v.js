viewModel.on("customInit", function (data) {
  viewModel.getParams().autoLoad = false;
  viewModel.pageNow = 1;
  viewModel.pageSizeNow = 10;
  var myContext = viewModel.getAppContext();
  var gridModel = viewModel.getGridModel();
  viewModel.on("afterMount", function () {
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      viewModel.getCache("FilterViewModel").getParams().filterRows = 2;
      viewModel.getParams().autoLoad = false;
      var gridModelInfo = viewModel.getGridModel();
      gridModelInfo.clear();
      var fv = viewModel.getCache("FilterViewModel").getData();
      var locationCode = fv.locationCode.value1;
      var locationName = fv.locationCode.value1;
      var product_name = fv.product_name.value1;
      var warehouse_name = fv.warehouse_name.value1;
      var product_sku_name = fv.product_sku_name.value1;
      var reqParams = {
        locationCode: locationCode,
        locationName: locationName,
        product_name: product_name,
        warehouse_name: warehouse_name,
        product_sku_name: product_sku_name,
        pageNow: viewModel.pageNow,
        pageSize: viewModel.pageSizeNow
      };
      setLocationData(viewModel, reqParams);
      //检索触发
      viewModel.on("beforeSearch", function (params) {
        console.log("[beforeSearch]");
        var locationName = filtervm.get("locationName").getFromModel().getValue();
        var locationCode = filtervm.get("locationCode").getFromModel().getValue();
        var product_name = filtervm.get("product_name").getFromModel().getValue();
        var rfid_code = filtervm.get("rfid_code").getFromModel().getValue();
        var warehouse_name = filtervm.get("warehouse_name").getFromModel().getValue();
        var product_sku_name = filtervm.get("product_sku_name").getFromModel().getValue();
        var reqParams = {
          locationCode: locationCode,
          locationName: locationName,
          rfid_code: rfid_code,
          product_name: product_name,
          warehouse_name: warehouse_name,
          product_sku_name: product_sku_name,
          pageNow: viewModel.pageNow,
          pageSize: viewModel.pageSizeNow
        };
        setLocationData(viewModel, reqParams);
        return false;
      });
    });
  });
  function setLocationData(viewModel, reqParams) {
    var gridModelInfo = viewModel.getGridModel();
    var params = viewModel.getParams();
    reqParams.currentUser = Object.assign(myContext.tenant, myContext.user);
    cb.rest.invokeFunction("cb2a1e81ba89446fa428d1c5d3b32091", reqParams, function (err, res) {
      if (err != undefined) {
        cb.utils.alert(err);
      } else {
        console.log(res);
        gridModelInfo.setState("dataSourceMode", "local");
        gridModelInfo.setDataSource(res.res.rst);
        gridModelInfo.setReadOnly(true);
        gridModelInfo.setPageInfo({
          pageSize: viewModel.pageSizeNow,
          pageIndex: viewModel.pageNow,
          recordCount: res.res.totalSize
        });
      }
    });
  }
  gridModel.on("pageInfoChange", function () {
    const filtervm = viewModel.getCache("FilterViewModel");
    //获取当前页码
    var pageIndex = gridModel.getPageIndex();
    //获取当前页条数
    var pageSize = gridModel.getPageSize();
    viewModel.pageNow = pageIndex;
    viewModel.pageSizeNow = pageSize;
    var locationName = filtervm.get("locationName").getFromModel().getValue();
    var locationCode = filtervm.get("locationCode").getFromModel().getValue();
    var product_name = filtervm.get("product_name").getFromModel().getValue();
    var rfid_code = filtervm.get("rfid_code").getFromModel().getValue();
    var warehouse_name = filtervm.get("warehouse_name").getFromModel().getValue();
    var product_sku_name = filtervm.get("product_sku_name").getFromModel().getValue();
    var reqParams = {
      locationCode: locationCode,
      locationName: locationName,
      rfid_code: rfid_code,
      product_name: product_name,
      warehouse_name: warehouse_name,
      product_sku_name: product_sku_name,
      pageNow: viewModel.pageNow,
      pageSize: viewModel.pageSizeNow
    };
    setLocationData(viewModel, reqParams);
  });
});
viewModel.get("button0fj") &&
  viewModel.get("button0fj").on("click", function (row) {
    // 详细--单击
    var rowdata = viewModel.getGridModel().getRow(row.index);
    console.log(JSON.stringify(rowdata));
    var params = viewModel.getParams();
    var myContext = viewModel.getAppContext();
    var yht_access_token = myContext.yat;
    var options = {
      domainKey: params.domainKey,
      yht_access_token: yht_access_token
    };
    let data = {
      domainKey: params.domainKey,
      billtype: "VoucherList", // 单据类型
      billno: "56c23219", // 单据号
      params: {
        mode: "browse", // (编辑态、新增态、浏览态)
        butReturn: true, //显示底部按钮
        reqParams: {
          locationCode: rowdata.locationCode,
          locationEpc: rowdata.rfid_code,
          product_name: rowdata.product_name,
          product_sku_name: rowdata.product_sku_name,
          product_id: rowdata.product_id,
          locationID: rowdata.id,
          warehouseID: rowdata.warehouseID
        }
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel);
  });