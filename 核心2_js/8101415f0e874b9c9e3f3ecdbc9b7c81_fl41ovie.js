viewModel.on("afterMount", function (data) {
  // 专项区域经营情况 --页面加载完成
  var viewModel = this;
  var mb;
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    //调用后端函数，获取当前登录用户
    cb.rest.invokeFunction("GT10891AT368.hdhs.getUserId", {}, function (err, res) {
      mb = res.Target[0].ziduan2;
      //获取查询模型
      let referModel_lcb = filtervm.get("nianzhuanxiangyewuzhibiao").getFromModel();
      //设置查询区默认值
      referModel_lcb.setValue(mb);
      filtervm.get("quyufuzeren").getFromModel().setValue(res.UserName);
      //参照模型初始化完成
      referModel_lcb.on("beforeBrowse", function (args) {
        //为查询区参照设置默认过滤条件
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "ziduan2",
          op: "eq",
          value1: mb
        });
        //设置查询区参照过滤条件
        this.setFilter(condition);
      });
    });
  });
});
viewModel.on("customInit", function (data) {
  // 专项区域经营情况 --页面初始化
});
viewModel.get("btnAdd") &&
  viewModel.get("btnAdd").on("click", function (data) {
    // 新增--单击
  });