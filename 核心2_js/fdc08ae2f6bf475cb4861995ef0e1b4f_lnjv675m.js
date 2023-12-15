viewModel.on("customInit", function (data) {
  viewModel.on("afterLoadData", function (args) {
    let isEnable = viewModel.get("isEnable").getValue();
    if (isEnable !== 0) {
      viewModel.get("btnSave").setVisible(false);
    }
    viewModel.get("flowbutton16xf").setVisible(false);
    var currentState = viewModel.getParams().mode;
    if (currentState == "browse" && isEnable == "0") {
      setTimeout(function () {
        viewModel.get("flowbutton16xf").setVisible(true);
      }, 1500);
    }
  });
  viewModel.on("afterLoadData", function (args) {
    let StaffNew = viewModel.get("StaffNew").getValue(); //系统员工ID
    if (StaffNew) {
      cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: StaffNew }, function (err, res) {
        if (res.res.code == "200") {
          let count = res.res.data.mainJobList.length;
          if (count == 0) {
            viewModel.get("item408nh").setValue(0);
          } else {
            if (cb.utils.isEmpty(res.res.data.mainJobList[count - 1].enddate)) {
              viewModel.get("item408nh").setValue(1);
            } else {
              viewModel.get("item408nh").setValue(0);
              viewModel.get("item438sg").setValue(res.res.data.mainJobList[count - 1].enddate);
            }
          }
        } else {
          console.log("校验有效任职时出错", res.res.message);
          cb.utils.alert("校验有效任职时出错", "info");
          viewModel.get("item408nh").setValue(0);
        }
      });
    } else {
      viewModel.get("item408nh").setValue(0);
    }
  });
});
viewModel.get("StaffNew") &&
  viewModel.get("StaffNew").on("afterValueChange", function (data) {
    //系统员工id--值改变后
    let StaffNew = viewModel.get("StaffNew").getValue(); //系统员工ID
    if (StaffNew) {
      cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: StaffNew }, function (err, res) {
        if (res.res.code == "200") {
          let count = res.res.data.mainJobList.length;
          if (count == 0) {
            viewModel.get("item408nh").setValue(0);
          } else {
            if (cb.utils.isEmpty(res.res.data.mainJobList[count - 1].enddate)) {
              viewModel.get("item408nh").setValue(1);
            } else {
              viewModel.get("item408nh").setValue(0);
              viewModel.get("item438sg").setValue(res.res.data.mainJobList[count - 1].enddate);
            }
          }
        } else {
          console.log("校验有效任职时出错", res.res.message);
          cb.utils.alert("校验有效任职时出错", "info");
          viewModel.get("item408nh").setValue(0);
        }
      });
    } else {
      viewModel.get("item408nh").setValue(0);
    }
  });
viewModel.get("item379pb") &&
  viewModel.get("item379pb").on("afterValueChange", function (data) {
    //停用的系统员工ID--值改变后
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