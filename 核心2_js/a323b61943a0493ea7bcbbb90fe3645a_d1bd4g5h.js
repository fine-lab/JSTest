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
  viewModel.get("button20ze") &&
    viewModel.get("button20ze").on("click", function (data) {
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
  viewModel.get("button17li") &&
    viewModel.get("button17li").on("click", function (data) {
      let dataset = {
        close: "1"
      };
      window.parent.postMessage(dataset, "*");
    });
});
viewModel.on("beforeSearch", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  //查询区afterResetClick事件，放在页面模型的afterMount和beforeSearch事件中可以生效
  filterViewModelInfo.on("afterResetClick", function (data) {
    let agentId = viewModel.getParams().query.agentId;
    debugger;
    filterViewModelInfo.get("cusname.id").getFromModel().setValue(agentId); //新增查询条件cusname.id的查询框
    //在这个钩子里返回false的话可以阻止后续的搜索动作(默认为true)
    return false;
  });
});