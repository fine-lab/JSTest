viewModel.on("customInit", function (data) {
  // 查询区启用主组织权限--页面初始化
  var org;
  cb.rest.invokeFunction("GT101670AT8.api.getOrg", {}, function (err, res) {
    org = res.OrgId;
  });
  //给查询区赋默认值
  viewModel.on("afterMount", function (event) {
    //获取查询区条件模型
    let filterViewModel = viewModel.getCache("FilterViewModel");
    //查询区模型DOM初始化后
    filterViewModel.on("afterInit", function () {
      //获取服务查询模型
      let referModel = filterViewModel.get("baseOrg").getFromModel();
      //赋予查询区字段初始值
      referModel.setValue(org);
      //参照模型初始化完成
      referModel_lcb.on("beforeBrowse", function (args) {
        //主要代码
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "baseOrg",
          op: "eq",
          value1: org
        });
        //设置过滤条件
        this.setFilter(condition);
      });
    });
  });
});