viewModel.on("customInit", function (data) {
  // 申请人参照组织过滤
  viewModel.get("applicant_name").on("beforeBrowse", function () {
    // 获取组织id
    const value = viewModel.get("org_id").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
  // 保存时调用页面后端函数
  viewModel.on("beforeSave", function (data) {
    var gridModelInfo = viewModel.getGridModel();
    debugger;
    var rowdata = [];
    // 获取各行的内容
    for (var i = 0; i < gridModelInfo.getRows().length; i++) {
      var tmpobj = {
        id: gridModelInfo.getCellValue(i, "id"),
        sourcechild_id: gridModelInfo.getCellValue(i, "sourcechild_id") //上游单据ID
      };
      rowdata.push(tmpobj); //添加行到rowdata
    }
    // 声明异步
    var returnPromise = new cb.promise();
    var param = {
      verifystate: viewModel.get("verifystate").getValue(), // 审批状态 0 开立 1审批中 2 已审批
      detaillist: rowdata // 表体
    };
    // 调用校验API函数
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.checkResumeFormSave", param, function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
        return false;
      }
      if (res.errInfo && res.errInfo.length > 0) {
        cb.utils.alert(res.errInfo, "error");
        return false;
      }
      returnPromise.resolve();
    });
    return returnPromise;
  });
  // 页面部门、员工默认赋值当前登录人
  viewModel.on("afterLoadData", function (args) {
    viewModel.on("modeChange", function (data) {
      let user = viewModel.get("applicant").getValue();
      if ((data === "add" || data === "edit") && (user == "" || user == null)) {
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("applicant").setValue(res.staffOfCurrentUser.id);
            viewModel.get("applicant_name").setValue(res.staffOfCurrentUser.name);
            viewModel.get("application_dept").setValue(res.staffOfCurrentUser.deptId);
            viewModel.get("application_dept_name").setValue(res.staffOfCurrentUser.deptName);
          }
        });
      }
    });
  });
});