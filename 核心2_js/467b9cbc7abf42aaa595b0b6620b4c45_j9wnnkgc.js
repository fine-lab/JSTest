viewModel.on("customInit", function (data) {
  // 费用报销--页面初始化
});
viewModel.get("salesOrg_name").on("beforeBrowse", function (data) {
  data.externalData = {
    noPermissionRequired: true
  };
});