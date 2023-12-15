viewModel.on("customInit", function (data) {
  // 学习计划_ydzs_1--页面初始化
  const allData = viewModel.getAllData();
  const grid = viewModel.get("gridlayout11cf");
  debugger;
  cb.rest.invokeFunction("GT8566AT282.rule.getPlanList", {}, function (err, res) {
    console.log(err, res);
    console.log(arguments);
    let gridObj = viewModel.__data.viewmeta.view.containers[2];
    let columnObjs = gridObj.containers; // 单元格
    if (columnObjs) {
      columnObjs.forEach(function (col) {
        let controls = col.controls;
        if (controls) {
          controls[0].cDefaultValue = "<p><img src='https://www.example.com/'>xxx学习计划名称<br>时间1-时间2<br><progress></p>";
        }
      });
    }
  });
});
viewModel.get("learning_plan_ydzs_1_1520417675622219777") &&
  viewModel.get("learning_plan_ydzs_1_1520417675622219777").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    console.log(data);
    const grid = viewModel.get("gridlayout11cf");
  });