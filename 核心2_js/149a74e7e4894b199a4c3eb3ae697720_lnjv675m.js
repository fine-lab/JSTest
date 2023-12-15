//增行后事件
viewModel.on("afterAddRow", function (params) {
  let index = params.data.index;
  viewModel.getGridModel("StaffJobList").setCellValue(index, "JobType", "1");
  viewModel.getGridModel("StaffJobList").setCellValue(index, "SysStaffJobType", "1");
});
viewModel.get("item142gd") &&
  viewModel.get("item142gd").on("afterValueChange", function (data) {
    //系统员工ID--值改变后
    let sysStaff = viewModel.get("item142gd").getValue(); //系统员工ID
    if (sysStaff) {
      cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: sysStaff }, function (err, res) {
        if (res.res.code == "200") {
          let count = res.res.data.mainJobList.length;
          if (count > 0) {
            if (cb.utils.isEmpty(res.res.data.mainJobList[count - 1].enddate)) {
              viewModel.getGridModel("StaffJobList").setCellValue(0, "JobType", "0");
              viewModel.getGridModel("StaffJobList").setCellValue(0, "SysStaffJobType", "1");
            } else {
              viewModel.getGridModel("StaffJobList").setCellValue(0, "JobType", "0");
              viewModel.getGridModel("StaffJobList").setCellValue(0, "SysStaffJobType", "0");
            }
          } else {
            viewModel.getGridModel("StaffJobList").setCellValue(0, "JobType", "0");
            viewModel.getGridModel("StaffJobList").setCellValue(0, "SysStaffJobType", "0");
          }
        } else {
          console.log("查询系统员工兼职任职时出错", res.res.message);
          cb.utils.alert("查询系统员工兼职任职时出错", "error");
        }
      });
    } else {
      viewModel.getGridModel("StaffJobList").setCellValue(0, "JobType", "0");
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
      cb.utils.alert("该手机号已经进行入职登记操作，无法进行初始化！", "waring");
      viewModel.get("btnSaveAndAdd").setVisible(false);
      viewModel.get("btnSave").setVisible(false);
    } else if (value == "initialization") {
      cb.utils.alert("该手机号已经进行员工初始化，请勿重复操作！", "waring");
      viewModel.get("btnSaveAndAdd").setVisible(false);
      viewModel.get("btnSave").setVisible(false);
    }
  });
viewModel.get("StaffJobList") &&
  viewModel.get("StaffJobList").on("beforeCellValueChange", function (data) {
    //表格-员工任职档案变动--单元格值改变前
    let cellName = data.cellName;
    if (cellName == "JobType") {
      //当任职兼职的值发生改变
      let value = data.value.value; //改变后的值
      let index = data.rowIndex; //发生改变的下标
      if (value == "0") {
        //将兼职改为任职
        let gridData = viewModel.getGridModel("StaffJobList").getData();
        for (let i = 0; i < gridData.length; i++) {
          let JobType = gridData[i].JobType;
          if (JobType == "0") {
            if (index !== i) {
              //说明已经有任职了，这个时候任职重复了
              viewModel.getGridModel("StaffJobList").setCellValue(i, "JobType", "1");
              let SysStaffJobType = gridData[i].SysStaffJobType;
              if (SysStaffJobType == "0") {
                viewModel.getGridModel("StaffJobList").setCellValue(i, "SysStaffJobType", "1");
                viewModel.getGridModel("StaffJobList").setCellValue(index, "SysStaffJobType", "0");
              }
              cb.utils.alert("任职记录只能有一条，\n已经为您将重复的任职修改为兼职！", "info");
            }
          }
        }
      } else if (value == "1") {
        //将任职改为兼职
      }
    }
    if (cellName == "sysDept_name") {
      let value = data.value.name; //改变后的值
      let index = data.rowIndex; //发生改变的下标
      let gridData = viewModel.getGridModel("StaffJobList").getData();
      for (let i = 0; i < gridData.length; i++) {
        let sysDept_name = gridData[i].sysDept_name;
        if (value == sysDept_name) {
          cb.utils.alert("任职部门不能重复！", "info");
          return false;
        }
      }
    }
  });
viewModel.on("beforeSave", function (args) {
  let gridData = viewModel.getGridModel("StaffJobList").getData();
  let count = 0;
  for (let i = 0; i < gridData.length; i++) {
    let JobType = gridData[i].JobType;
    if (JobType == "0") {
      count = count + 1;
    }
  }
  if (count == 0) {
    cb.utils.alert("必须有一条任职信息的任职类型为任职，\n请重新设置！", "info");
    return false;
  } else if (count > 1) {
    cb.utils.alert("只能有一条任职信息的任职类型为任职，\n请重新设置！", "info");
    return false;
  }
});
viewModel.get("mobile") &&
  viewModel.get("mobile").on("afterValueChange", function (data) {
    //手机号码--值改变后
    viewModel.getGridModel("StaffJobList").setCellValue(0, "JobType", "0");
    viewModel.getGridModel("StaffJobList").setCellValue(0, "SysStaffJobType", "0");
  });