viewModel.on("customInit", function (data) {
  // 水电暖结算表-工装详情--页面初始化
  //孙体过滤
  var gridModel = viewModel.getGridModel("gzxmxzList");
  let refModel = gridModel.getEditRowModel().get("shoufeixiangmu_name");
  refModel.on("beforeBrowse", function () {
    var conditions = {
      isExtend: true,
      simpleVOs: []
    };
    //物料分类为【工装预算报价】的子id
    let queryList = ["2681633272369920", "2722767139462400", "2681633473353728", "2722764923393792", "2681634437830912"];
    let parent = "2681632949769216";
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