viewModel.on("afterLoadData", function () {
  // 用于卡片页面，页面初始化赋值等操作
  cb.rest.invokeFunction("GT8429AT6.common.getEmployee", {}, function (err, res) {
    debugger;
    console.log(JSON.stringify(res));
    let deptid = res.deptObj[0].mainJobList_dept_id;
    let deptname = res.deptObj[0].mainJobList_dept_id_name;
    debugger;
    viewModel.get("apply_department").setValue(deptname);
  });
});
viewModel.on("afterValidate", function (data) {
  debugger;
  if (data && data.length == 1) {
    if (data[0].cItemName == "decorate_guide_detailList") {
      data.length = 0;
    }
  }
});
viewModel.on("beforeSave", function () {
  const data = viewModel.getAllData();
  console.log(JSON.stringify(data));
  debugger;
  let len = data.decorate_guide_detailList.length;
  if (!len) {
    cb.utils.alert("设备型号、设备台数未填写");
    return false;
  }
  let deviceList = data.decorate_guide_detailList;
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      let device_num = deviceList[i].device_num;
      if (device_num < 0) {
        cb.utils.alert("设备台数有误");
        return false;
      }
    }
  }
});