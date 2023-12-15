viewModel.get("issuer_name") &&
  viewModel.get("issuer_name").on("beforeBrowse", function (data) {
    // 可颁发人员--参照弹窗打开前
    debugger;
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.dept_id", // 取自参照getRefData数据中字段key
      op: "eq",
      value1: "1524861618136547335"
    });
    viewModel.get("issuer_name").setFilter(condition);
  });