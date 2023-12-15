viewModel.get("test0809_1789866108226895878") &&
  viewModel.get("test0809_1789866108226895878").on("beforeSetDataSource", function (data) {
    //表格--设置数据源前
    var GridData = [
      {
        name: "ll",
        age: "12"
      }
    ];
    debugger;
    viewModel.getGridModel().setDataSource(GridData);
  });