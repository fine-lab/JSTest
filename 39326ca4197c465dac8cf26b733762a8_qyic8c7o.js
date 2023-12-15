try {
  if (viewModel) {
    viewModel.on("afterMount", () => {
      viewModel.getGridModels().forEach((gridmodel, index) => {
        gridmodel.on("afterSetActionsState", function (actionsStates) {
          var rowDatas = gridmodel.getData();
          if (actionsStates) {
            rowDatas.forEach(function (row, index) {
              actionsStates[index]["btnCopy"] = { visible: false };
            });
          }
        });
      });
    });
  }
} catch (e) {
  console.log("----------------->", e);
}
viewModel.on("customInit", function (data) {
  // 差旅费报销单列表--页面初始化
});