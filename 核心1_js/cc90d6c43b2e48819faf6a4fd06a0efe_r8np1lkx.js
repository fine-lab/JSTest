viewModel.on("customInit", function (data) {
  //组织树参照单卡--页面初始化
  var viewModel = this;
  //当前参照显示的名字 如：orgId_name（字段别名）
  viewModel.get("baseOrg_name").on("beforeBrowse", function (event) {
    this.setState("externalData", {
      sceneCode: "hr_management"
    });
  });
});