viewModel.on("customInit", function (data) {
  const referModel = viewModel.get("item105kh_plan_time");
  referModel.setVisible(false);
  var girdModel = viewModel.getGridModel();
  viewModel.on("afterMount", function () {
    var x = viewModel.get("code");
    x.on("afterValueChange", function (data) {
      var pro_name = x.getValue();
      var tableUri = "GT22176AT10.GT22176AT10.SY01_trainrecordson";
      console.log("tableUri信息：" + tableUri);
      let fieldName = "code";
      console.log("fieldName信息：" + fieldName);
      let fieldValue = x.getValue();
      console.log("typenameValue信息：" + fieldValue);
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.fieldUniqueCheck", { tableUri: tableUri, fieldName: fieldName, fieldValue: fieldValue }, function (err, res) {
        console.log("res信息：" + res);
        if (!res.bo) {
          alert("名称有重复！");
        }
      });
    });
  });
  //提取培训计划
  viewModel.get("button15th").on("click", function (args) {
    let billId = viewModel.get("id").getValue();
    let orgId = viewModel.get("org_id").getValue();
    let data = {
      billtype: "VoucherList",
      billno: "b241a819List",
      domainKey: "sy01",
      params: {
        mode: "browse",
        type: "员工培训记录",
        orgId: orgId,
        billId: billId
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel);
    viewModel.get("item105kh_plan_time").browse(true);
  });
  viewModel.get("recorder_name_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  girdModel
    .getEditRowModel()
    .get("emp_code_code")
    .on("beforeBrowse", function () {
      let orgId = viewModel.get("org_id").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "mainJobList.org_id",
        op: "eq",
        value1: orgId
      });
      this.setFilter(condition);
    });
});