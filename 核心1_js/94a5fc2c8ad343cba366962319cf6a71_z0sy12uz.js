viewModel.on("customInit", function (data) {
  // 省市区信息_pfy--页面初始化
  viewModel.on("afterMount", function (event) {
    //先获取查询区条件模型
    let filterViewModel = viewModel.getCache("FilterViewModel");
    //查询区模型DOM初始化后
    filterViewModel.on("afterInit", function () {
      filterViewModel.get("vprov").getFromModel();
      cb.rest.invokeFunction("AT15B24E9C16C80002.backOpenApiFunction.getDistinctProc", { bintl: "Y" }, function (err, res) {
        console.log("---------------------------------");
        console.log(err);
        console.log(res.spendtime);
        console.log(res.res.length);
        console.log(res.res);
        console.log("---------------------------------");
        //给省份控件赋值
        filterViewModel.get("vprov").getFromModel().setValue(res.res);
      });
    });
  });
});