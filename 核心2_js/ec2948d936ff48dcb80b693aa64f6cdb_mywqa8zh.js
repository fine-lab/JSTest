viewModel.on("customInit", function (data) {
  //删除前
  viewModel.on("beforeDelete", function (params) {
    //获取当前的model
    let gridModel = viewModel.getGridModel();
    var data2 = 0;
    //使用数量
    for (var i = 0; i < gridModel.getData().length; i++) {
      data2 += gridModel.getCellValue(i, "usageQuantity");
    }
    var data = JSON.parse(params.data.data);
    if (data2 > 0) {
      cb.utils.confirm("禁止删除");
      return false;
    }
  });
  //保存前
  viewModel.on("beforeSave", function (args) {
    debugger;
    var data = viewModel.getRows()[args.data[0]];
    var currentRow = viewModel.getGridModel().getRow(args.index);
    var currentRow1 = viewModel.getGridModel().getRow();
    //判断使用数量是否小于实际数量
    //获取GridModel
    let gridModel1 = viewModel.getGridModel();
    var usageQuantity1 = gridModel1.getCellValue(0, "usageQuantity"); //使用数量
    var amount1 = gridModel1.getCellValue(0, "amount"); //数量
    if (parseFloat(usageQuantity1) > parseFloat(amount1)) {
      cb.utils.alert("使用数量需要小于数量");
      return false;
    }
    //判断物料编码是否重复
    let rows = gridModel1.getRows();
    for (var i = 0; i < rows.length - 1; i++) {
      for (var j = i + 1; j < rows.length; j++) {
        if (rows[i].materialCode_name == rows[j].materialCode_name) {
          cb.utils.confirm("物料编码  " + rows[i].materialCode_name + "  已存在");
          return false;
        }
      }
    }
    //判断项目编码是否重复
    //获取子页面项目编码
    let projectVO = viewModel.get("projectVO").getValue();
    let id = viewModel.get("id").getValue();
    //调用API,获取父页面所有项目编码
    var inner = cb.rest.invokeFunction(
      "GT8660AT38.hdhs.cxwlcfAPI",
      { projectVO: projectVO, id: id },
      function (err, res) {
        if (res != null) {
          cb.utils.confirm(res);
        }
      },
      viewModel,
      { async: false }
    );
    if (inner.result.returnif == "true") {
      cb.utils.confirm("已有相同项目");
      return false;
    }
  });
});