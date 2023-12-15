//增行前事件
viewModel.on("beforeAddRow", function (params) {
  let rows = viewModel.getGridModel("StaffJobList").getRows();
  let index = rows.length;
  let fieldName = params.params.fieldName;
  //主任职增行
  if (fieldName == "btnAddRowStaffJob") {
    //如果不是第一行，需要判断上一行的任职结束时间是否为空
    if (index !== 0) {
      let endDate = viewModel.getGridModel("StaffJobList").getCellValue(index - 1, "endDate");
      //如果上一条任职没有结束时间，不能增行
      if (endDate == undefined) {
        cb.utils.alert("上一条任职结束后，才能新增任职记录！", "info");
        return false;
      }
    }
  }
});
viewModel.get("item142gd") &&
  viewModel.get("item142gd").on("afterValueChange", function (data) {
    //系统员工ID--值改变后
    //要是作用是查询当前手机号对应的系统员工有无主任职
    let sysStaff = viewModel.get("item142gd").getValue(); //系统员工ID
    if (sysStaff) {
      cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: sysStaff }, function (err, res) {
        if (res.res.code == "200") {
          let count = res.res.data.mainJobList.length;
          if (count > 0) {
            if (cb.utils.isEmpty(res.res.data.mainJobList[count - 1].enddate)) {
              viewModel.get("item221ji").setValue(1);
              viewModel.getGridModel("StaffJobList").setCellValue(0, "SysStaffJobType", "1");
            }
          }
        } else {
          console.log("查询系统员工兼职任职时出错", res.res.message);
          cb.utils.alert("查询系统员工兼职任职时出错", "error");
        }
      });
    } else {
      viewModel.get("item221ji").setValue(0);
      viewModel.getGridModel("StaffJobList").setCellValue(0, "SysStaffJobType", "0");
    }
  });
viewModel.get("item342oa") &&
  viewModel.get("item342oa").on("afterValueChange", function (data) {
    //查重--值改变后
    let value = data.value;
    if (value == "0") {
      //说明没有重复录入
      viewModel.get("btnSaveAndAdd").setVisible(true);
      viewModel.get("btnSave").setVisible(true);
    } else if (value == "joinEntry") {
      cb.utils.alert("该手机号已经进行入职登记操作，请勿重复登记！", "waring");
      viewModel.get("btnSaveAndAdd").setVisible(false);
      viewModel.get("btnSave").setVisible(false);
    } else if (value == "initialization") {
      cb.utils.alert("该手机号已经进行员工初始化操作，无法进行员工登记！", "waring");
      viewModel.get("btnSaveAndAdd").setVisible(false);
      viewModel.get("btnSave").setVisible(false);
    }
  });