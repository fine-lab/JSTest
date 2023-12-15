viewModel.get("sysStaff") &&
  viewModel.get("sysStaff").on("afterValueChange", function (data) {
    // 系统员工id--值改变后
    let sysStaff = viewModel.get("sysStaff").getValue(); //系统员工ID
    if (sysStaff) {
      cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: sysStaff }, function (err, res) {
        if (res.res.code == "200") {
          let count = res.res.data.mainJobList.length;
          if (count == 0) {
            viewModel.get("item2721lk").setValue(0);
          } else {
            if (cb.utils.isEmpty(res.res.data.mainJobList[count - 1].enddate)) {
              viewModel.get("item2721lk").setValue(1);
              viewModel.getGridModel("gxsStaffMainJobList").setCellValue(0, "SysStaffJobType", "1");
            } else {
              viewModel.get("item2721lk").setValue(0);
              viewModel.get("item2656id").setValue(res.res.data.mainJobList[count - 1].enddate);
            }
          }
        } else {
          console.log("校验有效任职时出错", res.res.message);
          cb.utils.alert("校验有效任职时出错", "info");
          viewModel.get("item2721lk").setValue(0);
        }
      });
    } else {
      viewModel.get("item2721lk").setValue(0);
      viewModel.getGridModel("gxsStaffMainJobList").setCellValue(0, "SysStaffJobType", "0");
    }
  });
viewModel.get("item1827oc") &&
  viewModel.get("item1827oc").on("afterValueChange", function (data) {
    // 手机号校验--值改变后
    if (!cb.utils.isEmpty(data.value)) {
      viewModel.get("item1827oc").setVisible(true);
    } else {
      viewModel.get("item1827oc").setVisible(false);
    }
  });
viewModel.get("item2094hk") &&
  viewModel.get("item2094hk").on("afterValueChange", function (data) {
    // 本组织员工校验--值改变后
    if (!cb.utils.isEmpty(data.value)) {
      viewModel.get("item2094hk").setVisible(true);
    } else {
      viewModel.get("item2094hk").setVisible(false);
    }
  });
viewModel.get("item2539th") &&
  viewModel.get("item2539th").on("afterValueChange", function (data) {
    // 停用员工的系统id--值改变后
    let sysStaff = viewModel.get("item2539th").getValue(); //系统员工ID
    cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: sysStaff }, function (err, res) {
      if (res.res.code == "200") {
        let count = res.res.data.mainJobList.length;
        viewModel.get("item2656id").setValue(res.res.data.mainJobList[count - 1].enddate);
      } else {
        console.log("查询上一个主任职结束日期时出错", res.res.message);
        cb.utils.alert("查询上一个主任职结束日期时出错", "info");
        viewModel.get("item2721lk").setValue(0);
      }
    });
  });
viewModel.get("button109rh") &&
  viewModel.get("button109rh").on("click", function (data) {
    //保存--单击
    setTimeout(function () {
      viewModel.get("btnSave").execute("click");
    }, 1000);
  });
viewModel.on("beforeAddRow", function (params) {
  //获取所有子表列表的数据，查看最后一行的任职结束日期是否为空  空：不显示  非空：显示
  let rows = viewModel.getGridModel("gxsStaffMainJobList").getRows();
  let rowsCount = rows.length;
  let endDate = rows[rowsCount - 1].endDate;
  if (cb.utils.isEmpty(endDate)) {
    cb.utils.alert("当前已经有主任职，无法新增主任职", "info");
    return false;
  }
});