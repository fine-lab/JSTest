viewModel.get("button21pi") &&
  viewModel.get("button21pi").on("click", function (data) {
    // 新增项目--单击
    let gridModel = viewModel.getGridModel();
    gridModel.insertRow(0, {});
  });
viewModel.on("afterLoadData", function (data) {
  let gridModel = viewModel.getGridModel();
  let rows = gridModel.getRows();
  if (rows.length == 0) {
    gridModel.insertRow(0, { jianJiXiangMu: 1 }); //aimix建机
    gridModel.insertRow(1, { jianJiXiangMu: 2 }); //aimix重机
    gridModel.insertRow(2, { jianJiXiangMu: 3 }); //aimix小机
    gridModel.insertRow(3, { jianJiXiangMu: 4 }); //aimix二手车
    gridModel.insertRow(4, { jianJiXiangMu: 5 }); //aisteel钢构
  }
});