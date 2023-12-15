viewModel.on("customInit", function (data) {
  //采购合同备份--页面初始化
});
viewModel.get("button13ph") &&
  viewModel.get("button13ph").on("click", function (data) {
    //按钮--单击
    for (let i = 1; i <= 1; i++) {
      let res = cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.test1", { page: i }, function (err, res) {}, viewModel, { async: false });
      debugger;
    }
  });