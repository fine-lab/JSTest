viewModel.on("customInit", function (data) {
  // 水电暖结算表-家装详情--页面初始化
  //孙体过滤
  var gridModel = viewModel.getGridModel("xmxzList");
  let refModel = gridModel.getEditRowModel().get("shoufeixiangmu_name");
  refModel.on("beforeBrowse", function () {
    var conditions = {
      isExtend: true,
      simpleVOs: []
    };
    //物料分类为【家装预算报价】的子id
    let queryList = ["2681599245145088", "2681599927849216", "2681600914724352", "2681601146935808", "2681600260331776"];
    let parent = "2681598102297088";
    let treeCondition = {
      isExtend: true,
      simpleVOs: [
        {
          field: "parent",
          op: "eq",
          value1: parent
        }
      ]
    };
    conditions.simpleVOs.push({
      logicOp: "and",
      conditions: [
        {
          field: "manageClass",
          op: "in",
          value1: queryList
        }
      ]
    });
    this.setFilter(conditions);
    this.setTreeFilter(treeCondition);
  });
});