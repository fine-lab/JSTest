viewModel.on("customInit", function (data) {
});
let referValue = "";
viewModel.on("afterLoadData", function (event) {
  viewModel.get("selection_of_construction_drawings_customer_name").on("beforeBrowse", function () {
    var viewModel = this;
    debugger;
    // 获取当前编辑行的品牌字段值
    const value = "";
    // 实现品牌的过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "apply_username_v2",
      op: "eq",
      value1: referValue
    });
    this.setFilter(condition);
  });
});
viewModel.get("selection_of_construction_drawings_customer_name") &&
  viewModel.get("selection_of_construction_drawings_customer_name").on("beforeBrowse", function (data) {
    // 施工图申请选择--参照弹窗打开前
    referValue = viewModel.get("apply_username_v2").getValue();
    debugger;
  });
viewModel.on("afterValidate", function (data) {
  debugger;
  if (data && data.length > 0) {
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
  } else if (len == 1) {
    let fistDevice = data.decorate_guide_detailList[0].device_model;
    let fistDeviceNum = data.decorate_guide_detailList[0].device_num;
    if (!fistDevice || !fistDeviceNum) {
      cb.utils.alert("设备型号、设备台数未填写");
      return false;
    }
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
viewModel.get("apply_username") &&
  viewModel.get("apply_username").on("afterValueChange", function (data) {
    // 申请人--值改变后
    let username = data.value;
    let value = viewModel.get("apply_username_v2_name").getValue();
    viewModel.get("apply_username_v2_name").setValue(username);
    debugger;
  });
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "957fc45a";
});