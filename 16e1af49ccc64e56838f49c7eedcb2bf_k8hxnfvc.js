viewModel.get("period_name") &&
  viewModel.get("period_name").on("beforeBrowse", function (data) {
    //所属期间--参照弹窗打开前
    let res = cb.rest.invokeFunction("AT1A0D359C16680006.api.getMyApplyPeriod", {}, function (err, res) {}, viewModel, { async: false });
    let { periodList } = res.result;
    let ids = ["good-luck-for-u"];
    for (var i = 0; i < periodList.length; i++) {
      ids.push(periodList[i].id);
    }
    var myFilter = { isExtend: true, simpleVOs: [] };
    myFilter.simpleVOs.push({
      field: "id",
      op: "in",
      value1: ids
    });
    viewModel.get("period_name").setFilter(myFilter);
  });
viewModel.on("modeChange", function (data) {
  viewModel.get("agree").setDisabled(false);
  if (data == "add") {
    //设置申报期间
    cb.rest.invokeFunction("AT1A0D359C16680006.api.getMyApplyPeriod", {}, function (err, res) {
      let { periodList } = res;
      if (!periodList || periodList.length == 0) {
        cb.utils.alert("没有节税期间");
        viewModel.get("btnSave").setDisabled(true);
        viewModel.get("btnSaveAndAdd").setDisabled(true);
        return;
      }
      debugger;
      if (periodList.length > 1) {
        viewModel.get("period_name").setDisabled(false);
      } else {
        viewModel.get("period_name").setDisabled(true);
      }
      let period = periodList[0];
      let { id, name, description } = period;
      viewModel.get("period").setValue(id);
      viewModel.get("period_name").setValue(name);
      viewModel.get("description").setValue(description);
    });
    //设置个人信息
    cb.rest.invokeFunction("AT1A0D359C16680006.api.getMyStaff", {}, function (err, res) {
      let { code, name, email, mainJob } = res;
      if (!name) {
        return;
      }
      viewModel.get("psnEmail").setValue(email);
      viewModel.get("psnCode").setValue(code);
      viewModel.get("psnName").setValue(name);
      viewModel.get("dept_name").setValue(mainJob["dept_id_name"]);
      viewModel.get("dept").setValue(mainJob["dept_id"]);
      viewModel.get("org_id_name").setValue(mainJob["org_id_name"]);
      viewModel.get("org_id").setValue(mainJob["org_id"]);
      viewModel.get("staffNew").setValue(mainJob["staff_id"]);
      viewModel.get("staffNew_name").setValue(name);
    });
  }
});