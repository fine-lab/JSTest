viewModel.get("button25hb")?.setVisible(true);
viewModel.get("button25hb")?.on("click", function (data) {
  let arr = [
    "billtype",
    "freect_h",
    "manufacture_date",
    "initinspectorder_code",
    "warranty_date",
    "warranty_unit",
    "pk_material_productPropCharacterDefine",
    "validityDate",
    "vchangerate",
    "castunitid_name",
    "pk_sample_name",
    "inspectionplanSingle",
    "pk_test_name",
    "spotchekastnum",
    "spotcheknum",
    "pk_inspecter_name",
    "pk_inspectdept_name",
    "inspectRule",
    "pk_inspectionplan_name",
    "pk_prod_dept_name",
    "inspectastnum",
    "pk_applycheckorg_name",
    "pk_applycheckdept_name",
    "applycheckbillType",
    "vapplycheckcode",
    "sourcebilltype",
    "vsourcecode",
    "sourcerowno",
    "pk_busiperiod",
    "busistartDate",
    "busiendDate",
    "inspectionplanVersion",
    "define1",
    "recheck",
    "qastnum",
    "nqastnum",
    "samnum",
    "unsamnum",
    "chastnum",
    "chnum",
    "chrate",
    "createTime",
    "modifier",
    "modifyTime",
    "auditor",
    "auditTime"
  ];
  debugger;
  // 显示/隐藏--单击
  let gridModel = viewModel.get("qms_qms_prodinspectorder_h_16103574084731");
  let all = gridModel.getColumns("auditTime");
  for (var i = 0; i < arr.length; i++) {
    let bShowIt = gridModel.getColumnState(arr[i], "bShowIt");
    if (bShowIt) {
      gridModel.setColumnState(arr[i], "bShowIt", false);
    } else {
      gridModel.setColumnState(arr[i], "bShowIt", true);
    }
  }
});