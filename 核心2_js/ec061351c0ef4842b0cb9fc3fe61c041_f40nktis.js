viewModel.on("afterLoadData", function () {
  // 用于卡片页面，页面初始化赋值等操作
  cb.rest.invokeFunction("GT8429AT6.CommonFunction.getEmployee", {}, function (err, res) {
    debugger;
    console.log(JSON.stringify(res));
    let name = JSON.parse(res.res).currentUser.name;
    let staffId = JSON.parse(res.res).currentUser.staffId;
    let deptid = res.deptObj[0].mainJobList_dept_id;
    let deptname = res.deptObj[0].mainJobList_dept_id_name;
    debugger;
    viewModel.get("person_name").setValue(name);
    viewModel.get("person").setValue(staffId);
    viewModel.get("startdept_name").setValue(deptname);
    viewModel.get("startdept").setValue(deptid);
  });
});