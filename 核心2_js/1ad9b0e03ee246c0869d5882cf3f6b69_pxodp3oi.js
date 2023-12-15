viewModel.get("button16vj") &&
  viewModel.get("button16vj").on("click", function (data) {
    //事业部信息--单击
    let gridModel = viewModel.getGridModel().getData();
    console.log("result:" + gridModel);
    for (var i = 0; i < gridModel.length; i++) {
      let grid = gridModel[i];
      let id = grid.id; //shiyebu_name
      let org_id = "youridHere";
      let org_id_name = "AIMIX建机事业部";
      viewModel.getGridModel().setCellValue(i, "org_id_name", org_id_name);
      viewModel.getGridModel().setCellValue(i, "org_id", org_id);
      console.log("id:" + id);
      let result = cb.rest.invokeFunction("AT17DBCECA09580004.rule.UpdateShiYeBu", { id: id, org_id: org_id, org_id_name: org_id_name }, function (err, res) {}, viewModel, { async: false });
    }
  });