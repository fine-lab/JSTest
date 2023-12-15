viewModel.on("customInit", function (data) {
  // 返利政策--页面初始化
  viewModel.get("button24bc") &&
    viewModel.get("button24bc").on("click", function () {
      // 按钮--单击
      debugger;
      let dataSet = viewModel.getGridModel().getAllData();
      let ds = [];
      for (let i = 0; i < dataSet.length; i++) {
        if (dataSet[i]["balance"] == undefined) {
          ds.push({
            id: dataSet[i].id,
            PolApplAmount: dataSet[i].PolApplAmount,
            balance: dataSet[i].balance
          });
        }
      }
      cb.rest.invokeFunction("c717296929f8473e8fd70836fbe2b9cb", { data: ds }, function (err, res) {
        debugger;
      });
    });
});