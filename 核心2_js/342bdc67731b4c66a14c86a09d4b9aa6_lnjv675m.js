viewModel.on("customInit", function (data) {
  viewModel.on("afterSave", function (data) {
    let info = data.res;
    cb.rest.invokeFunction("GT34544AT7.orgManager.orgAdmAddPtJApi", { object: info }, function (err, res) {
      console.log("返回值:");
      console.log(res);
    });
    cb.cache.set("refresh", "1");
  });
});
viewModel.get("item379pb") &&
  viewModel.get("item379pb").on("afterValueChange", function (data) {
    // 停用的系统员工ID--值改变后
    let sysStaff = viewModel.get("item379pb").getValue(); //系统员工ID
    cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: sysStaff }, function (err, res) {
      if (res.res.code == "200") {
        let count = res.res.data.mainJobList.length;
        viewModel.get("item438sg").setValue(res.res.data.mainJobList[count - 1].enddate);
      } else {
        console.log("查询上一个主任职结束日期时出错", res.res.message);
        cb.utils.alert("查询上一个主任职结束日期时出错", "info");
        viewModel.get("item408nh").setValue(0);
      }
    });
  });
viewModel.get("button6ib") &&
  viewModel.get("button6ib").on("click", function (data) {
    //保存--单击
    setTimeout(function () {
      viewModel.get("btnSave").execute("click");
    }, 1000);
  });
viewModel.on("customInit", function (data) {
  viewModel.on("afterLoadData", function (args) {
    let SysUser = viewModel.get("GxsStaffFk_gxyUser_SysUser").getValue();
    viewModel.get("SysUser").setValue(SysUser);
    let SysUserCode = viewModel.get("GxsStaffFk_gxyUser_SysUserCode").getValue();
    viewModel.get("SysUserCode").setValue(SysUserCode);
  });
});