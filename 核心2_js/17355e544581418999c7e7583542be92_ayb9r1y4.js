viewModel.on("customInit", function (data) {
  //盖章表单详情--页面初始化
  viewModel.on("afterLoadData", function () {
    debugger;
    var tt = cb.rest.invokeFunction("GT102917AT3.API.queryid", {}, function (err, res) {}, viewModel, { async: false });
    var data = tt.result.ss.data;
    var deptName = data[tt.result.currentUser.id] == undefined ? "" : data[tt.result.currentUser.id].deptName;
    var name = data[tt.result.currentUser.id] == undefined ? tt.result.currentUser.name : data[tt.result.currentUser.id].name;
    viewModel.get("informant").setValue(name);
    viewModel.get("departmentOfTheApplicant").setValue(deptName);
  });
});