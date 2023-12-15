viewModel.on("customInit", function (data) {
});
viewModel.on("beforeSave", function (args) {
  debugger;
  let sublist = JSON.parse(args.data.data).construction_drawing_detailList;
  if (!sublist) {
    cb.utils.alert("施工图图纸详情不能为空");
    return false;
  } else {
    let sublist_len = JSON.parse(args.data.data).construction_drawing_detailList.length;
    if (sublist_len > 0) {
      for (var i = 0; i < sublist_len; i++) {
        let deviceModel = sublist[i].device_model_v2;
        let deviceNum = sublist[i].device_num_int;
        if (!deviceModel) {
          cb.utils.alert("设备型号未填写");
          return false;
        }
        if (deviceNum < 0) {
          cb.utils.alert("设备数量有误");
          return false;
        }
      }
    }
  }
});
viewModel.on("afterLoadData", function () {
  // 用于卡片页面，页面初始化赋值等操作
  cb.rest.invokeFunction("GT8429AT6.CommonFunction.getEmployee", {}, function (err, res) {
    debugger;
    console.log(JSON.stringify(res));
    let deptid = res.deptObj[0].mainJobList_dept_id;
    let deptname = res.deptObj[0].mainJobList_dept_id_name;
    debugger;
    viewModel.get("apply_department").setValue(deptname);
  });
});
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "b06f316a";
});