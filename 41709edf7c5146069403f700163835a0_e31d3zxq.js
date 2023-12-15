viewModel.on("customInit", function (data) {
  var gridModelInfo = viewModel.getGridModel("SY01_detailsonList");
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
  gridModelInfo
    .getEditRowModel()
    .get("proBatchNo_batchno")
    .on("beforeBrowse", function () {
      // 获取组织id
      let ordId = viewModel.get("org_id").getValue();
      const productId = gridModelInfo.getEditRowModel().get("material_code").getValue();
      // 实现选择用户的组织id过滤
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      //是否gmp物料
      condition.simpleVOs.push({
        field: "product",
        op: "eq",
        value1: productId
      });
      //会计主体
      condition.simpleVOs.push({
        field: "accountOrg",
        op: "eq",
        value1: ordId
      });
      this.setFilter(condition);
    });
  // 保存时调用页面后端函数
  viewModel.on("beforeSave", function (data) {
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
  viewModel.get("application_dept_name").on("beforeBrowse", function (data) {
    var externalData = {};
    externalData.ref_parentorgid = viewModel.get("org_id").getValue();
    (externalData.funcCode = "all"), (externalData.accountdelegate = "true"), viewModel.get("application_dept_name").setState("externalData", externalData);
  });
  //部门切换，或清空，清空验收员
  viewModel.get("application_dept_name").on("afterValueChange", function (data) {
    if (data.value == null || (data.oldValue != null && data.value.id != data.oldValue.id)) {
      viewModel.get("applicant").setValue(null);
      viewModel.get("applicant_name").setValue(null);
    }
  });
  // 页面部门、员工默认赋值当前登录人
  viewModel.on("afterLoadData", function (args) {
    viewModel.on("modeChange", function (data) {
      let user = viewModel.get("applicant").getValue();
      if (data === "add" || data === "edit") {
        let rows = gridModelInfo.getRows();
        if (rows.length > 0) {
          for (let i = 0; i < rows.length; i++) {
            let producedate = rows[i].manufacture_date;
            let invaliddate = rows[i].valid_until;
            if (producedate != undefined) {
              let manufactureDate = FormatToDate(producedate);
              gridModelInfo.setCellValue(i, "manufacture_date", manufactureDate);
            }
            if (invaliddate != undefined) {
              let validUntil = FormatToDate(invaliddate);
              gridModelInfo.setCellValue(i, "valid_until", validUntil);
            }
          }
        }
        if (user == "" || user == null) {
          cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
            if (res != undefined && res.staffOfCurrentUser != undefined) {
              viewModel.get("applicant").setValue(res.staffOfCurrentUser.id);
              viewModel.get("applicant_name").setValue(res.staffOfCurrentUser.name);
              viewModel.get("application_dept").setValue(res.staffOfCurrentUser.deptId);
              viewModel.get("application_dept_name").setValue(res.staffOfCurrentUser.deptName);
            }
          });
        }
      }
    });
  });
  function FormatToDate(val) {
    if (val != null) {
      var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
      var year = date.getFullYear();
      if (typeof year != "string") {
        year = year.toString();
      }
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1; //补0
      if (typeof month != "string") {
        month = month.toString();
      }
      var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      if (typeof currentDate != "string") {
        currentDate = currentDate.toString();
      }
      return year + "-" + month + "-" + currentDate;
    }
    return "";
  }
});