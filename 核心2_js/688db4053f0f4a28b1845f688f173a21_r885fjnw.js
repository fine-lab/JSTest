var gridModel = viewModel.getGridModel();
console.log(gridModel);
viewModel.get("button16oc") &&
  viewModel.get("button16oc").on("click", function (data) {
    //同步分类信息--单击
    cb.rest.invokeFunction("AT1842C9F808800002.rule.test615", {}, function (err, res) {
      console.log(err);
      console.log(res);
      viewModel.execute("refresh"); //刷新页面
    });
  });
viewModel.get("button20gc") &&
  viewModel.get("button20gc").on("click", function (data) {
    //编辑--单击
    gridModel.setReadOnly(false); //设置gridModel可编辑
    console.log(data);
  });
viewModel.get("button32cc") &&
  viewModel.get("button32cc").on("click", function (data) {
    //保存--单击
    //获取实体模型
    var rows = viewModel.getGridModel().getRows();
    console.log(rows);
    rows.forEach((row) => {
      cb.rest.invokeFunction("AT1842C9F808800002.backOpenApiFunction.save", { row }, function (err, res) {
        console.log(err, "404");
        console.log(res, "200");
      });
    });
  });
viewModel.get("btnAdd") &&
  viewModel.get("btnAdd").on("click", function (data) {
    //新增--单击
    var gridModel = viewModel.get("basebooktypes_1748854315928256513");
    gridModel.appendRow({});
    gridModel.setReadOnly(false); //设置gridModel可编辑
  });
viewModel.get("button38pb") &&
  viewModel.get("button38pb").on("click", function (data) {
    //插入--单击
    var rows = viewModel.getGridModel().insertRows();
    console.log(rows);
    rows.forEach((row) => {
      cb.rest.invokeFunction("AT1842C9F808800002.backOpenApiFunction.saveall", { row }, function (err, res) {
        console.log(err);
        console.log(res);
      });
    });
  });