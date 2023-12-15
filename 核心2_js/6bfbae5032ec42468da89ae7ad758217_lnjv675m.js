viewModel.on("afterSave", function (data) {
});
viewModel.get("StaffNew") &&
  viewModel.get("StaffNew").on("afterValueChange", function (data) {
    // 系统员工id--值改变后
    let StaffNew = viewModel.get("StaffNew").getValue(); //系统员工ID
    cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: StaffNew }, function (err, res) {
      if (res.res.code == "200") {
        let count = res.res.data.mainJobList.length;
        if (count == 0) {
          viewModel.get("item259di").setValue(0);
        } else {
          if (cb.utils.isEmpty(res.res.data.mainJobList[count - 1].enddate)) {
            viewModel.get("item259di").setValue(1);
          } else {
            viewModel.get("item259di").setValue(0);
            viewModel.get("item286df").setValue(res.res.data.mainJobList[count - 1].enddate);
          }
        }
      } else {
        console.log("校验有效任职时出错", res.res.message);
        viewModel.get("item259di").setValue(0);
      }
    });
  });
viewModel.get("item278eh") &&
  viewModel.get("item278eh").on("afterValueChange", function (data) {
    // 停用的系统员工ID--值改变后
    let sysStaff = viewModel.get("item278eh").getValue(); //系统员工ID
    cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: sysStaff }, function (err, res) {
      if (res.res.code == "200") {
        let count = res.res.data.mainJobList.length;
        viewModel.get("item286df").setValue(res.res.data.mainJobList[count - 1].enddate);
      } else {
        console.log("查询上一个主任职结束日期时出错", res.res.message);
        cb.utils.alert("查询上一个主任职结束日期时出错", "info");
        viewModel.get("item259di").setValue(0);
      }
    });
  });