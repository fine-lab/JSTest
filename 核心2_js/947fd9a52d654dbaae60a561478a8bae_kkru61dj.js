run = function (event) {
  var viewModel = this;
  let switchDisplayFields = function (gridModel, number) {
    number = parseInt(number);
    let fields = Object.keys(gridModel.getColumns());
    for (let i = 0; i < fields.length; i++) {
      gridModel.setColumnState(fields[i], "visible", false);
      gridModel.setColumnState(fields[i], "bCanModify", false);
    }
    switch (number) {
      case 1:
        gridModel.setColumnState("material_name", "visible", true);
        gridModel.setColumnState("materialCode", "visible", true);
        gridModel.setColumnState("listingPermitHolder_ip_name", "visible", true);
        break;
      case 2:
        gridModel.setColumnState("materialType_catagoryname", "visible", true);
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
};