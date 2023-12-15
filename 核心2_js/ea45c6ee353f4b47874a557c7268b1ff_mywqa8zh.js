viewModel.get("mujianbianma_name") &&
  viewModel.get("mujianbianma_name").on("afterValueChange", function (data) {
    // 母件编码--值改变后
    debugger;
    // 改变后清除所有行
    var gridModel = viewModel.getGridModel();
    var value = data.value;
    var old = data.oldValue;
    if (value == null) {
      gridModel.deleteAllRows();
    }
    var grid = viewModel.getGridModel("salesOrderDetiyList");
    var code = data.value.code;
    var tt = cb.rest.invokeFunction("GT7682AT32.API.querySun", { code: code }, function (err, res) {}, viewModel, { async: false });
    if (tt.result.array != undefined) {
      for (var i = 0; i < tt.result.array.length; i++) {
        grid.appendRow(tt.result.array[i]);
      }
    }
  });
viewModel.get("button27ob") &&
  viewModel.get("button27ob").on("click", function (data) {
    // 会弹出你想要的东西--单击
    debugger;
    //获取选中行的行号
    var line = data.index;
    //获取选中行数据信息
    var mujianbianma = viewModel.getGridModel().getRow(line);
    // 传递给被打开页面的数据信息
    let tt = {
      billtype: "VoucherList", // 单据类型
      billno: "43610939", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        mujianbianma: mujianbianma
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", tt, viewModel);
  });
viewModel.get("button34dd") &&
  viewModel.get("button34dd").on("click", function (data) {
    // 刷新--单击
    debugger;
  });