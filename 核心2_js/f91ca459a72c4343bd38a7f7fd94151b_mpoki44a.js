//页面DOM加载完成
viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    let referModel = filtervm.get("xiangmumingchen").getFromModel();
    //获取组织参照
    let orgRefModel = filtervm.get("xiangmuzuzhi").getFromModel();
    orgRefModel.on("afterValueChange", function (args) {
      let org_value = orgRefModel.getValue();
      debugger;
      //参照模型初始化完成
      referModel.on("beforeBrowse", function (args) {
        //主要代码
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "orgid",
          op: "eq",
          value1: org_value
        });
        if (org_value) {
          //设置过滤条件
          this.setFilter(condition);
        } else {
          this.setFilter({
            isExtend: true,
            simpleVOs: []
          });
        }
      });
    });
  });
});