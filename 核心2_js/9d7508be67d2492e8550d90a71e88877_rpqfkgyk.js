viewModel.on("beforeSave", function () {
  var projectName = viewModel.get("name").getValue();
  let res = cb.rest.invokeFunction("GT8429AT6.rule.projectSave", { name: projectName }, function (err, res) {}, viewModel, { async: false });
  if (res.error) {
    cb.utils.alert(res.error.message);
    return false;
  } else {
    let tipInfo = `添加项目 ${res.responseObj.data.name.zh_CN} 成功`;
    cb.utils.alert(tipInfo);
  }
});
viewModel.on("afterLoadData", function () {
  // 用于卡片页面，页面初始化赋值等操作
  cb.rest.invokeFunction("GT8429AT6.common.getEmployeeNew", {}, function (err, res) {
    let name = JSON.parse(res.res).currentUser.name;
    let staffId = JSON.parse(res.res).currentUser.staffId;
    let deptid = res.deptObj[0].mainJobList_dept_id;
    let deptname = res.deptObj[0].mainJobList_dept_id_name;
    viewModel.get("person_name").setValue(name);
    viewModel.get("person").setValue(staffId);
    viewModel.get("startdept_name").setValue(deptname);
    viewModel.get("startdept").setValue(deptid);
  });
});