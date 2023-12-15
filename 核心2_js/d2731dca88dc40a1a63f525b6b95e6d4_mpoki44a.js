//页面加载完成
viewModel.on("afterMount", function (event) {
  let filterViewModel = viewModel.getCache("FilterViewModel");
  //查询区模型DOM初始化后
  filterViewModel.on("afterInit", function () {
    debugger;
    let referModel = filterViewModel.get("projectVO").getFromModel();
    //参照模型初始化完成
    referModel.on("beforeBrowse", function (args) {
      let projectOrgRefModel = filterViewModel.get("org_id").getFromModel();
      //获取组织参照选择的值
      let orgValue = projectOrgRefModel.getValue();
      debugger;
      //主要代码
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "orgid",
        op: "eq",
        value1: orgValue
      });
      //设置过滤条件
      this.setFilter(condition);
    });
    debugger;
  });
});