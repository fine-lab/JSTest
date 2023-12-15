viewModel.on("customInit", function (data) {
  let agentId = "";
  // 搜索框添加查询条件
  // 搜索框添加查询条件
  viewModel.on("afterMount", function (data) {
    let agentId = viewModel.getParams().query.agentId; // 获取传值(其他页面跳转过来URL携带参数的数据)
    const FilterViewModel = viewModel.getCache("FilterViewModel");
    FilterViewModel.getParams().autoLoad = false; //原来默认查询功能关闭
    FilterViewModel.on("afterInit", function () {
      // 进行查询区相关扩展
      FilterViewModel.get("cusname.id").getFromModel().setValue(agentId); //新增查询条件cusname.id的查询框
      FilterViewModel.get("search").fireEvent("click"); //自动触发点击查询按钮功能
      FilterViewModel.get("cusname.id").getFromModel().setVisible(false); //cusname.id的查询框在页面隐藏不显示
    });
  });
  viewModel.get("btnAdd") && viewModel.get("btnAdd").on("click", function (data) {});
  viewModel.get("button17bb") &&
    viewModel.get("button17bb").on("click", function (data) {
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
  viewModel.get("button20pg") &&
    viewModel.get("button20pg").on("click", function (data) {
      let dataset = {
        close: "1"
      };
      window.parent.postMessage(dataset, "*");
    });
});