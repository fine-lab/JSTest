viewModel.on("customInit", function (data) {
  let switchDisplayFields = function (gridModel, number) {
    number = parseInt(number);
    let fields = Object.keys(gridModel.getColumns());
    for (let i = 0; i < fields.length; i++) {
      gridModel.setColumnState(fields[i], "visible", false);
    }
    switch (number) {
      case 1:
        gridModel.setColumnState("material_name", "visible", true);
        gridModel.setColumnState("materialCode", "visible", true);
        gridModel.setColumnState("listingPermitHolder_ip_name", "visible", true);
        break;
      case 2:
        gridModel.setColumnState("materialType_catagoryname", "visible", true);
        gridModel.setColumnState("item204sg", "visible", true);
        gridModel.setColumnState("item315pj", "visible", true);
        gridModel.setColumnState("item427sa", "visible", true);
        gridModel.setColumnState("item477vd", "visible", true);
        break;
      case 3:
        gridModel.setColumnState("dosageForm_dosagaFormName", "visible", true);
        break;
      case 4:
        gridModel.setColumnState("material_name", "visible", true);
        gridModel.setColumnState("materialCode", "visible", true);
        gridModel.setColumnState("sku_code", "visible", true);
        gridModel.setColumnState("skuName", "visible", true);
        gridModel.setColumnState("listingPermitHolder_ip_name", "visible", true);
        break;
      case 5:
        gridModel.setColumnState("material_name", "visible", true);
        gridModel.setColumnState("materialCode", "visible", true);
        gridModel.setColumnState("feature", "visible", true);
        gridModel.setColumnState("listingPermitHolder_ip_name", "visible", true);
        break;
    }
  };
  viewModel.on("afterMount", function () {
    viewModel.on("beforeAttachment", function (params) {
      if (params.childrenField != undefined && (params.childrenField == "SY01_supplier_file_licenseList" || params.childrenField == "SY01_supplier_file_certifyList")) {
        params.objectName = "mdf";
      }
    });
  });
  var zzGridModelName = "SY01_supplier_file_licenseList";
  var zzfw_gridModel = viewModel.getGridModel("SY01_supplier_file_license_authList");
  //初始化时参照查询值
  zzfw_gridModel.on("beforeSetDataSource", function (data) {
    let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(viewModel.getGridModel(zzGridModelName).getFocusedRowIndex(), "authType");
    switchDisplayFields(zzfw_gridModel, sqType);
  });
  var authEntrustGridModelName = "SY01_supplier_file_certifyList";
  var authEntrustTypeCellName = "authType";
  var authEntrustGridModel = viewModel.getGridModel(authEntrustGridModelName);
  var authRangeGridModel = viewModel.getGridModel("SY01_supplier_file_certify_authList");
  //初始化时参照查询值
  authRangeGridModel.on("beforeSetDataSource", function (data) {
    let sqType = authEntrustGridModel.getCellValue(authEntrustGridModel.getFocusedRowIndex(), authEntrustTypeCellName);
    switchDisplayFields(authRangeGridModel, sqType);
  });
  viewModel.on("afterLoadData", function (args) {
  });
  viewModel.on("beforeSave", function (args) {
    let licenseRows = viewModel.getGridModel("SY01_supplier_file_licenseList").getRows(); //证照子表
    let zzfwRows = viewModel.getGridModel("SY01_supplier_file_license_authList"); //证照孙表
    let certifyRows = viewModel.getGridModel("SY01_supplier_file_certifyList").getRows(); //授权委托书子表
    let certifyAuthRows = viewModel.getGridModel("SY01_supplier_file_certify_authList").getRows(); //授权委托书孙表
    let otherRepRows = viewModel.getGridModel("SY01_supplier_file_certifyList").getRows(); //其他组织报告
    let data = args.data.data;
    let gridModelInfo = viewModel.get("SY01_material_file_childList");
    let rows = gridModelInfo.getRows();
    cb.rest.invokeFunction(
      "GT22176AT10.sygl.updateFirBatFile",
      {
        type: "供应商",
        data: data,
        licenseRows: licenseRows,
        zzfwRows: zzfwRows,
        certifyRows: certifyRows,
        certifyAuthRows: certifyAuthRows,
        otherRepRows: otherRepRows,
        urlM1: "GT22176AT10.GT22176AT10.SY01_fccompauditv4",
        urlC1: "GT22176AT10.GT22176AT10.sy01_vendor_other_report",
        urlC2: "GT22176AT10.GT22176AT10.SY01_poavv4",
        urlC3: "GT22176AT10.GT22176AT10.SY01_syqysp_xgzzv4",
        urlS1: "GT22176AT10.GT22176AT10.SY01_poalv5",
        urlS2: "GT22176AT10.GT22176AT10.SY01_syqysp_xgzz_v4",
        billCode1: "6f8efa8a"
      },
      function (err, res) {
        debugger;
        if (typeof res != "undefined") {
          console.log(res);
        } else if (typeof err != "undefined") {
          cb.utils.alert(err.message, "error");
          console.log(err);
          return false;
        }
      }
    );
  });
});