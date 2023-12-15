viewModel.get("localOrgRegisterParam_createTime") &&
  viewModel.get("localOrgRegisterParam_createTime").on("beforeBrowse", function (data) {
    //监管业务方案--参照弹窗打开前
  });
viewModel.on("customInit", function (data) {
  //产权占有登记管理详情--页面初始化
  viewModel.on("beforeSave", function (args) {
    let localOrgRegisterParam_createTime = viewModel.get("localOrgRegisterParam_createTime").getValue();
    if (!localOrgRegisterParam_createTime) {
      cb.utils.alert("监管业务方案是必填项！", "info");
    }
  });
});
viewModel.get("FoundDate") &&
  viewModel.get("FoundDate").on("beforeValueChange", function (data) {
    //成立日期--值改变前
    let RegistrDate = viewModel.get("RegistrDate").getValue();
    let FoundDate = data.value;
    if (cb.utils.isEmpty(RegistrDate)) {
      cb.utils.alert("请先填写登记基准日！", "info");
      return false;
    } else {
      if (!cb.utils.isEmpty(FoundDate)) {
        if (new Date(FoundDate) > new Date(RegistrDate)) {
          cb.utils.alert("成立日期需要在登记日期之前！", "info");
          return false;
        }
      }
    }
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    //监管组织--参照弹窗打开前
    console.log("data", JSON.stringify(data));
  });