viewModel.get("StaffNew") &&
  viewModel.get("StaffNew").on("afterValueChange", function (data) {
    // 系统员工ID--值改变后
    let StaffNew = viewModel.get("StaffNew").getValue(); //系统员工ID
    if (StaffNew) {
      cb.rest.invokeFunction("GT34544AT7.common.staffDetail", { id: StaffNew }, function (err, res) {
        if (res.res.code == "200") {
          let count = res.res.data.mainJobList.length;
          if (count == 0) {
            viewModel.get("item641we").setValue(0);
          } else {
            if (cb.utils.isEmpty(res.res.data.mainJobList[count - 1].enddate)) {
              viewModel.get("item641we").setValue(1);
            } else {
              viewModel.get("item641we").setValue(0);
              viewModel.get("item778rk").setValue(res.res.data.mainJobList[count - 1].enddate);
            }
          }
        } else {
          console.log("校验有效任职时出错", res.res.message);
          cb.utils.alert("校验有效任职时出错", "info");
          viewModel.get("item641we").setValue(0);
        }
      });
    } else {
      viewModel.get("item641we").setValue(0);
    }
  });
viewModel.get("test_GxyRole_name") &&
  viewModel.get("test_GxyRole_name").on("beforeBrowse", function (data) {
    //供销云角色--参照弹窗打开前
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "code",
      op: "in",
      value1: ["MULTI201", "MULTI001"] //值
    });
    this.setFilter(condition);
  });
viewModel.get("button12jc") &&
  viewModel.get("button12jc").on("click", function (data) {
    //保存--单击
    setTimeout(function () {
      viewModel.get("btnSave").execute("click");
    }, 1000);
  });