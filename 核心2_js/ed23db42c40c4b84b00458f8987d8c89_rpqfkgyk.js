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
let referValue = "";
viewModel.on("afterLoadData", function (event) {
  let referModel = viewModel.get("selection_of_construction_drawings_sales_contract_code");
  debugger;
  //查询区模型DOM初始化后
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
      field: "apply_username",
      op: "eq",
      value1: referValue
    });
    this.setFilter(condition);
  });
});
viewModel.get("selection_of_construction_drawings_sales_contract_code") &&
  viewModel.get("selection_of_construction_drawings_sales_contract_code").on("beforeBrowse", function (data) {
    // 施工图申请选择--参照弹窗打开前
    referValue = viewModel.get("apply_username").getValue();
    debugger;
  });
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "957fc45a";
});