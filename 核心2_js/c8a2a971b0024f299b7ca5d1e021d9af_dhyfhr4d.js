viewModel.on("customInit", function (data) {
  // 党建要闻管理--页面初始化
  var viewModel = this;
  viewModel.on("beforeSearch", function (args) {
    //字段sex等于男的数据进行查询
    args.params.condition.simpleVOs = [
      {
        field: "newscategory",
        op: "eq",
        value1: "2909848307257600"
      }
    ];
    //等同于 args.params.condition.commonVOs = [{"itemName":"schemeName","value1":"默认方案"},{"itemName":"isDefault","value1":true},{"value1":"20","itemName":"age"}]
  });
});