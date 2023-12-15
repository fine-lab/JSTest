viewModel.on("customInit", function (data) {
});
let referValue = "";
viewModel.on("afterLoadData", function (event) {
  let referModel = viewModel.get("selection_of_construction_drawings_sales_contract_code");
  debugger;
  // 查询区模型DOM初始化后
  referModel.on("beforeBrowse", function () {
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
viewModel.get("selection_of_construction_drawings_sales_contract_code") &&
  viewModel.get("selection_of_construction_drawings_sales_contract_code").on("beforeBrowse", function (data) {
    // 施工图申请选择--参照弹窗打开前
    referValue = viewModel.get("apply_username_v2").getValue();
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