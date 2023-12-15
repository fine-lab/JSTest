viewModel.on("customInit", function (data) {
  viewModel.getParams().autoLoad = false;
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
      var rfid_code = fv.rfid_code.value1;
      var rfidcodeByproduct = fv.rfidcodeByproduct.value1;
      debugger;
      var reqParams = {
        locationCode: locationCode,
        locationName: locationName,
        product_name: product_name,
        rfid_code: rfid_code,
        rfidcodeByproduct: rfidcodeByproduct
      };
      setLocationData(viewModel, reqParams);
      //检索触发
      viewModel.on("beforeSearch", function (params) {
        console.log("[beforeSearch]");
        var locationName = filtervm.get("locationName").getFromModel().getValue();
        var locationCode = filtervm.get("locationCode").getFromModel().getValue();
        var product_name = filtervm.get("product_name").getFromModel().getValue();
        var rfid_code = filtervm.get("rfid_code").getFromModel().getValue();
        var rfidcodeByproduct = filtervm.get("rfidcodeByproduct").getFromModel().getValue();
        var reqParams = {
          locationCode: locationCode,
          locationName: locationName,
          product_name: product_name,
          rfid_code: rfid_code,
          rfidcodeByproduct: rfidcodeByproduct
        };
        setLocationData(viewModel, reqParams);
        return false;
      });
    });
  });
  function setLocationData(viewModel, reqParams) {
    debugger;
    var gridModelInfo = viewModel.getGridModel();
    var params = viewModel.getParams();
    cb.rest.invokeFunction("cb2a1e81ba89446fa428d1c5d3b32091", reqParams, function (err, res) {
      if (err != undefined) {
        cb.utils.alert(err);
      } else {
        console.log(res);
        var pageNow = viewModel.pageNow;
        var pageSizeNow = viewModel.pageSizeNow;
        gridModelInfo.setState("dataSourceMode", "local");
        console.log(res.rst);
        gridModelInfo.setDataSource(res.rst);
        gridModelInfo.setReadOnly(true);
      }
    });
  }
});