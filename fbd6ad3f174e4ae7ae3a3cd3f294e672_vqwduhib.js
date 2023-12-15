viewModel.on("customInit", function (data) {
  let sy_factory_report = viewModel.getGridModel("sy_factory_reportList");
  let sy_factory_report_scope = viewModel.getGridModel("sy_factory_report_scopeList");
  sy_factory_report.on("afterCellValueChange", function (data) {
    if (data.cellName == "license_auth_type" && data.value != data.oldValue) {
      sy_factory_report_scope.deleteAllRows();
      let fields = Object.keys(sy_factory_report_scope.getColumns());
      for (let i = 0; i < fields.length; i++) {
        sy_factory_report_scope.setColumnState(fields[i], "visible", false);
      }
      switch (data.value.value) {
        case "1":
          sy_factory_report_scope.setColumnState("pro_auth_type_name", "visible", true);
          break;
        case "2":
          sy_factory_report_scope.setColumnState("protype_auth_type_name", "visible", true);
          break;
        case "3":
          sy_factory_report_scope.setColumnState("dosage_auth_type_dosagaFormName", "visible", true);
          break;
      }
    }
  });
  viewModel.get("department_name").on("beforeBrowse", function (data) {
    var externalData = {};
    externalData.ref_parentorgid = viewModel.get("org_id").getValue();
    (externalData.funcCode = "all"), (externalData.accountdelegate = "true"), viewModel.get("department_name").setState("externalData", externalData);
  });
  viewModel.get("department_name").on("afterValueChange", function (data) {
    viewModel.get("staff").setValue(null);
    viewModel.get("staff_name").setValue(null);
  });
  //申请人过滤
  viewModel.get("staff_name").on("beforeBrowse", function (data) {
    let applydepId = viewModel.get("department").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.dept_id",
      op: "eq",
      value1: applydepId
    });
    this.setFilter(condition);
  });
  sy_factory_report_scope.on("beforeSetDataSource", function (params) {
    let license_auth_type = sy_factory_report.getCellValue(sy_factory_report.getFocusedRowIndex(), "license_auth_type");
    let fields = Object.keys(sy_factory_report_scope.getColumns());
    for (let i = 0; i < fields.length; i++) {
      sy_factory_report_scope.setColumnState(fields[i], "visible", false);
    }
    switch (license_auth_type) {
      case "1":
        sy_factory_report_scope.setColumnState("pro_auth_type_name", "visible", true);
        break;
      case "2":
        sy_factory_report_scope.setColumnState("protype_auth_type_name", "visible", true);
        break;
      case "3":
        sy_factory_report_scope.setColumnState("dosage_auth_type_dosagaFormName", "visible", true);
        break;
    }
  });
});