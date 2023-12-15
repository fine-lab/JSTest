viewModel.on("customInit", function (data) {
  viewModel.getParams().autoLoad = false;
  viewModel.pageNow = 1;
  viewModel.pageSizeNow = 10;
  var gridModel = viewModel.getGridModel();
  viewModel.on("afterMount", function () {
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      viewModel.getCache("FilterViewModel").getParams().filterRows = 2;
      viewModel.getParams().autoLoad = false;
      var gridModelInfo = viewModel.getGridModel();
      gridModelInfo.clear();
      var fv = viewModel.getCache("FilterViewModel").getData();
      console.log(fv);
      var locationCode = fv.locationCode.value1;
      var locationName = fv.locationCode.value1;
      var product_name = fv.product_name.value1;
      var warehouse_name = fv.warehouse_name.value1;
      var product_sku_name = fv.product_sku_name.value1;
      debugger;
      var reqParams = {
        locationCode: locationCode,
        locationName: locationName,
        product_name: product_name,
        warehouse_name: warehouse_name,
        product_sku_name: product_sku_name,
        pageNow: viewModel.pageNow,
        pageSize: viewModel.pageSizeNow
      };
      console.log(reqParams);
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
    console.log(params);
    cb.rest.invokeFunction("cb2a1e81ba89446fa428d1c5d3b32091", reqParams, function (err, res) {
      if (err != undefined) {
        cb.utils.alert(err);
      } else {
        console.log(res);
        gridModelInfo.setState("dataSourceMode", "local");
        console.log(res.res.rst);
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