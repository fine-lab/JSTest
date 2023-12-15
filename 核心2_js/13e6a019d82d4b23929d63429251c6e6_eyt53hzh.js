run = function (event) {
  var viewModel = this;
  let switchDisplayFields = function (gridModel, number) {
    number = parseInt(number);
    let fields = ["material_name", "materialCode", "sku_code", "skuName", "materialType_catagoryname", "dosageForm_dosagaFormName", "listingPermitHolder_ip_name"];
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
  var disAbledArr = [];
  disAbledArr.push("org_id_name");
  disAbledArr.push("customer_code");
  disAbledArr.push("customerType_typename");
  disAbledArr.push("marketingRange");
  disAbledArr.push("qualitySystem");
  disAbledArr.push("electronicSupervisionCode");
  disAbledArr.push("importLicense");
  disAbledArr.push("specimenOfSeal");
  disAbledArr.push("taxRegistrationCertify");
  disAbledArr.push("gspCertificate");
  disAbledArr.push("purchAndSalesStaff");
  disAbledArr.push("qualityAssurAgreement");
  disAbledArr.push("certifyPurchSalesPerson");
  disAbledArr.push("orgCodeCertify");
  disAbledArr.push("handlingEnterpriseLicense");
  disAbledArr.push("powerAttorney");
  disAbledArr.push("purchSaleContract");
  disAbledArr.push("annualReport");
  disAbledArr.push("sy01_customers_file_licenseList");
  disAbledArr.push("sy01_customers_file_lic_authList");
  disAbledArr.push("SY01_customers_file_certifyList");
  disAbledArr.push("SY01_customers_file_cer_authList");
  viewModel.on("afterMount", function () {
    viewModel.on("beforeAttachment", function (params) {
      if (params.childrenField != undefined && (params.childrenField == "sy01_customers_file_licenseList" || params.childrenField == "SY01_customers_file_certifyList")) {
        params.objectName = "mdf";
      }
    });
    viewModel.on("afterLoadData", function () {
      if (viewModel.getParams().mode == "edit") {
        if (viewModel.get("firstMarketingStatus").getValue() == 1 || viewModel.get("firstMarketingStatus").getValue() == "1") {
          for (let i = 0; i < disAbledArr.length; i++) {
            viewModel.get(disAbledArr[i]).setReadOnly(true);
          }
        }
      }
    });
  });
  viewModel.on("modeChange", function (data) {
    if (data == "edit") {
      if (viewModel.get("firstMarketingStatus").getValue() == 1 || viewModel.get("firstMarketingStatus").getValue() == "1") {
        for (let i = 0; i < disAbledArr.length; i++) {
          viewModel.get(disAbledArr[i]).setState("bCanModify", false);
        }
      }
    }
  });
  viewModel.get("customerType_typename").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "org_id",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  var zzGridModelName = "sy01_customers_file_licenseList";
  var zzfw_gridModel = viewModel.getGridModel("sy01_customers_file_lic_authList");
  //相关证照授权类型  切换时，将列换成对应的参照,且删除全部子表
  viewModel.getGridModel(zzGridModelName).on("afterCellValueChange", function (data) {
    if (data.cellName == "authType" && data.value != data.oldValue) {
      zzfw_gridModel.deleteAllRows();
      let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(data.rowIndex, "authType");
      switchDisplayFields(zzfw_gridModel, sqType);
    }
  });
  //初始化时参照查询值
  zzfw_gridModel.on("beforeSetDataSource", function (data) {
    let sqType = viewModel.getGridModel(zzGridModelName).getCellValue(viewModel.getGridModel(zzGridModelName).getFocusedRowIndex(), "authType");
    switchDisplayFields(zzfw_gridModel, sqType);
  });
  var authEntrustGridModelName = "SY01_customers_file_certifyList";
  var authEntrustTypeCellName = "authType";
  var authEntrustGridModel = viewModel.getGridModel(authEntrustGridModelName);
  var authRangeGridModel = viewModel.getGridModel("SY01_customers_file_cer_authList");
  //授权委托书中授权类型   切换时，将列换成对应的参照,且删除全部子表
  viewModel.getGridModel(authEntrustGridModelName).on("afterCellValueChange", function (data) {
    if (data.cellName == "authType" && data.value != data.oldValue) {
      authRangeGridModel.deleteAllRows();
      switchDisplayFields(authRangeGridModel, data.value.value);
    }
  });
  //初始化时参照查询值
  authRangeGridModel.on("beforeSetDataSource", function (data) {
    let sqType = authEntrustGridModel.getCellValue(authEntrustGridModel.getFocusedRowIndex(), authEntrustTypeCellName);
    switchDisplayFields(authRangeGridModel, sqType);
  });
  viewModel.getGridModel(zzGridModelName).on("afterInsertRow", function (data) {
    viewModel.getGridModel(zzGridModelName).setCellValue(data.index, "customerCode", viewModel.get("customer_code").getValue());
    viewModel.getGridModel(zzGridModelName).setCellValue(data.index, "customerName", viewModel.get("customerName").getValue());
  });
  zzfw_gridModel.on("afterInsertRow", function (data) {
    zzfw_gridModel.setCellValue(data.index, "customerCode", viewModel.get("customer_code").getValue());
    zzfw_gridModel.setCellValue(data.index, "customerName", viewModel.get("customerName").getValue());
  });
  viewModel.getGridModel(authEntrustGridModelName).on("afterInsertRow", function (data) {
    viewModel.getGridModel(authEntrustGridModelName).setCellValue(data.index, "customersCode", viewModel.get("customer_code").getValue());
    viewModel.getGridModel(authEntrustGridModelName).setCellValue(data.index, "customersName", viewModel.get("customerName").getValue());
  });
  authRangeGridModel.on("afterInsertRow", function (data) {
    authRangeGridModel.setCellValue(data.index, "customerCode", viewModel.get("customer_code").getValue());
    authRangeGridModel.setCellValue(data.index, "customerName", viewModel.get("customerName").getValue());
  });
  viewModel.get("customer_code").on("afterValueChange", function (data) {
    let materialCode = data.value == null ? undefined : data.value.code;
    let materialName = data.value == null ? undefined : data.value.name;
    let licenses = viewModel.getGridModel(zzGridModelName).getRows();
    let auths = viewModel.getGridModel(authEntrustGridModelName).getRows();
    for (let i = 0; i < licenses.length; i++) {
      licenses[i]["customerCode"] = materialCode;
      licenses[i]["customerName"] = materialName;
      let licenses_ls = licenses[i]["sy01_customers_file_lic_authList"];
      if (licenses_ls != null) {
        for (let j = 0; j < licenses_ls.length; j++) {
          licenses_ls[j]["customerCode"] = materialCode;
          licenses_ls[j]["customerName"] = materialName;
        }
      }
    }
    viewModel.getGridModel(zzGridModelName).setDataSource(licenses);
    for (let i = 0; i < auths.length; i++) {
      auths[i]["customersCode"] = materialCode;
      auths[i]["customersName"] = materialName;
      let auths_ls = auths[i]["SY01_customers_file_cer_authList"];
      if (auths_ls != undefined) {
        for (let j = 0; j < auths_ls.length; j++) {
          auths_ls[j]["customerCode"] = materialCode;
          auths_ls[j]["customerName"] = materialName;
        }
      }
    }
    viewModel.getGridModel(authEntrustGridModelName).setDataSource(auths);
  });
};