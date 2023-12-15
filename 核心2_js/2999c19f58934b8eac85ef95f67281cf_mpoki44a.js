//页面DOM加载完成
viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    //获取项目参照模型的真实模型
    let projectModel = filtervm.get("xiangmumingchen").getFromModel();
    //获取cbs参照模型的真实模型
    let cbsModel = filtervm.get("jieduan_A").getFromModel();
    //获取组织参照
    let orgRefModel = filtervm.get("org_id").getFromModel();
    //组织参照值数据改变之后事件
    orgRefModel.on("afterValueChange", function (args) {
      let org_value = orgRefModel.getValue();
      //项目参照模型初始化完成
      projectModel.on("beforeBrowse", function (args) {
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
    //项目参照值数据改变之后事件
    projectModel.on("afterValueChange", function (args) {
      let projectValue = args.obj ? args.obj.text : "";
      cbsModel.on("beforeBrowse", function (args) {
        //主要代码
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "randKeywords",
          op: "eq",
          value1: projectValue
        });
        if (projectValue) {
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