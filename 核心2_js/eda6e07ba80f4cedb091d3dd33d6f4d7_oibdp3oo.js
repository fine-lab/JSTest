viewModel.on("customInit", function (data) {
  let agentId = "";
  // 搜索框添加查询条件
  viewModel.on("afterMount", function (data) {
    debugger;
    agentId = viewModel.getParams().query.agentId;
  });
  viewModel.get("btnAdd") && viewModel.get("btnAdd").on("click", function (data) {});
  viewModel.get("button8we") &&
    viewModel.get("button8we").on("click", function (data) {
      let gridModel = viewModel.getGridModel();
      const selectData = gridModel.getSelectedRows();
      if (selectData.length === 0) {
        cb.utils.alert("请选中地址再保存");
        return false;
      }
      let dataset = {
        close: "1",
        selectData: selectData
      };
      window.parent.postMessage(dataset, "*");
    });
  viewModel.get("button11va") &&
    viewModel.get("button11va").on("click", function (data) {
      let dataset = {
        close: "1"
      };
      window.parent.postMessage(dataset, "*");
    });
});