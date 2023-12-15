viewModel.get("button27cf") &&
  viewModel.get("button27cf").on("click", function (data) {
    //事业部信息--单击
    let gridModel = viewModel.getGridModel().getData();
    console.log("result:" + gridModel);
    for (var i = 0; i < gridModel.length; i++) {
      let grid = gridModel[i];
      let id = grid.id; //shiyebu_name
      let shiyebu = "1573831220346748939";
      let shiyebuName = "环保优化组";
      viewModel.getGridModel().setCellValue(i, "bumen_name", shiyebuName);
      viewModel.getGridModel().setCellValue(i, "bumen", shiyebu);
      console.log("id:" + id);
      let result = cb.rest.invokeFunction("AT17DBCECA09580004.rule.updateBuMen", { id: id, bumen: shiyebu, bumen_name: shiyebuName }, function (err, res) {}, viewModel, { async: false });
    }
  });