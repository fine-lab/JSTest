viewModel.on("beforeSave", function (data) {
  debugger;
});
viewModel.get("button42aj")?.setVisible(true);
viewModel.get("button42aj")?.on("click", function (data) {
  let arr = [
    "attachmentId",
    "rownum",
    "pk_inspect_itemclass_name",
    "keyitem_b",
    "pk_sample_method_name",
    "spotcheck_rate",
    "fixed_samples",
    "feature_name",
    "record_value_b",
    "check_number",
    "qualified_number",
    "unqualified_number",
    "ac_value",
    "re_value",
    "inspect_min_value",
    "inspect_max_value",
    "inspect_avg_value",
    "index_nature",
    "accuracy",
    "round_off_rule",
    "multisample_inspectval_type",
    "attach_sample_b",
    "pk_inspect_detectbasis_name",
    "qualify_grade_result",
    "inspector_name",
    "inspectdate",
    "inspecttime",
    "vnote",
    "id",
    "inspectvalue_type",
    "inspectvalue_unit_name"
  ];
  debugger;
  // 显示/隐藏--单击
  let gridModel = viewModel.get("qms_qit_incominspectorder_bList");
  for (var i = 0; i < arr.length; i++) {
    let bShowIt = gridModel.getColumnState(arr[i], "bShowIt");
    if (bShowIt) {
      gridModel.setColumnState(arr[i], "bShowIt", false);
    } else {
      gridModel.setColumnState(arr[i], "bShowIt", true);
    }
  }
});
viewModel.get("qms_qit_incominspectorder_bList") &&
  viewModel.get("qms_qit_incominspectorder_bList").on("afterSetDataSource", function (data) {
    //检验信息--设置数据源后
    debugger;
    let arr = [
      "attachmentId",
      "rownum",
      "pk_inspect_itemclass_name",
      "keyitem_b",
      "pk_sample_method_name",
      "spotcheck_rate",
      "fixed_samples",
      "feature_name",
      "record_value_b",
      "check_number",
      "qualified_number",
      "unqualified_number",
      "ac_value",
      "re_value",
      "inspect_min_value",
      "inspect_max_value",
      "inspect_avg_value",
      "index_nature",
      "accuracy",
      "round_off_rule",
      "multisample_inspectval_type",
      "attach_sample_b",
      "pk_inspect_detectbasis_name",
      "qualify_grade_result",
      "inspector_name",
      "inspectdate",
      "inspecttime",
      "vnote",
      "id",
      "inspectvalue_type",
      "inspectvalue_unit_name"
    ];
  });