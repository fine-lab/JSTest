viewModel.get("button24zc") &&
  viewModel.get("button24zc").on("click", function (data) {
    //品类信息--单击
    let gridModel = viewModel.getGridModel().getData();
    console.log("result:" + gridModel);
    for (var i = 0; i < gridModel.length; i++) {
      let grid = gridModel[i];
      let id = grid.id;
      let cpmc = "1584400215733436434"; //产品大类ID
      let cpmcName = "搅拌站"; //产品大类名称
      viewModel.getGridModel().setCellValue(i, "xqcp_productName", cpmcName); //‘字段名’，脚本名
      viewModel.getGridModel().setCellValue(i, "xqcp", cpmc);
      console.log("id:" + id);
      let result = cb.rest.invokeFunction("GT3734AT5.backOpenApiFunction.updateCPMC", { id: id, xqcp: cpmc, xqcp_productName: cpmcName }, function (err, res) {}, viewModel, { async: false });
    }
  });