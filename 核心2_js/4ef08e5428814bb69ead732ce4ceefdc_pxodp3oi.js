viewModel.get("button22qj") &&
  viewModel.get("button22qj").on("click", function (data) {
    //事业部信息--单击
    let gridModel = viewModel.getGridModel().getData();
    console.log("result:" + gridModel);
    for (var i = 0; i < gridModel.length; i++) {
      let grid = gridModel[i];
      let id = grid.id; //shiyebu_name
      let shiyebu = "1573823532355289104";
      let shiyebuName = "AIMIX建机事业部";
      viewModel.getGridModel().setCellValue(i, "shiyebu_name", shiyebuName);
      viewModel.getGridModel().setCellValue(i, "shiyebu", shiyebu);
      console.log("id:" + id);
      let result = cb.rest.invokeFunction("AT17854C0208D8000B.backOpenApiFunction.updateShiYeBu", { id: id, shiyebu: shiyebu, shiyebuName: shiyebuName }, function (err, res) {}, viewModel, {
        async: false
      });
    }
  });