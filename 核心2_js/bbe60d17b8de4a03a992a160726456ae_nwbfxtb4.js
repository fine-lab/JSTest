viewModel.get("button22pg") &&
  viewModel.get("button22pg").on("click", function (data) {
    // 查库存修改交易类型--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    const seldata = gridModel.getSelectedRows();
    if (seldata.length == 0) {
      cb.utils.alert("请选择数据");
    } else {
      cb.rest.invokeFunction("15966bc5f73a4659a8ed05b128cf6ce0", { data: seldata }, function (err, res) {
        console.log(err);
        console.log(res);
        viewModel.execute("refresh");
      });
    }
  });
viewModel.get("button44kg") &&
  viewModel.get("button44kg").on("click", function (data) {
    // 补充订单信息--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    const seldata = gridModel.getSelectedRows();
    if (seldata.length == 0) {
      cb.utils.alert("请选择数据");
    } else {
      cb.rest.invokeFunction("e65e8c06da4645babe6b4fafac78d5cd", { data: seldata }, function (err, res) {
        console.log(err);
        console.log(res);
        viewModel.execute("refresh");
      });
    }
  });
viewModel.get("button68xg") &&
  viewModel.get("button68xg").on("click", function (data) {
    // 修改为项目单--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    const seldata = gridModel.getSelectedRows();
    if (seldata.length == 0) {
      cb.utils.alert("请选择数据");
    } else {
      cb.rest.invokeFunction("df6932cfc10644628f2c7d9fae634c9b", { data: seldata }, function (err, res) {
        console.log(err);
        console.log(res);
        viewModel.execute("refresh");
      });
    }
  });
viewModel.get("button94tc") &&
  viewModel.get("button94tc").on("click", function (data) {
    // 修改客户--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    const seldata = gridModel.getSelectedRows();
    if (seldata.length == 0) {
      cb.utils.alert("请选择数据");
    } else {
      cb.rest.invokeFunction("cfffc4ce1b22434bba0313bb4724017b", { data: seldata }, function (err, res) {
        console.log(err);
        console.log(res);
        viewModel.execute("refresh");
      });
    }
  });
viewModel.get("button115sc") &&
  viewModel.get("button115sc").on("click", function (data) {
    // 京东世纪信息--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    const seldata = gridModel.getSelectedRows();
    if (seldata.length == 0) {
      cb.utils.alert("请选择数据");
    } else {
      cb.rest.invokeFunction("501863a4fccc4c9eb5e329b2db372a5f", { data: seldata }, function (err, res) {
        console.log(err);
        console.log(res);
        viewModel.execute("refresh");
      });
    }
  });
viewModel.get("button136uk") &&
  viewModel.get("button136uk").on("click", function (data) {
    // 修改为运营项目单--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    const seldata = gridModel.getSelectedRows();
    if (seldata.length == 0) {
      cb.utils.alert("请选择数据");
    } else {
      cb.rest.invokeFunction("c490d0bac18a45cf96104b9c9396c3b3", { data: seldata }, function (err, res) {
        console.log(err);
        console.log(res);
        viewModel.execute("refresh");
      });
    }
  });