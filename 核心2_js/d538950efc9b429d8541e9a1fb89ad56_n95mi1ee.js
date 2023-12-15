//修改参照数据范围的方法
function ReferCondition(girdModel, value) {
  var simpleVOsValue1 = [];
  if (value == "xmbm2") {
    simpleVOsValue1 = ["0000000002", "0000000003"]; //过滤的值可以多值
  }
  girdModel
    .getEditRowModel()
    .get("product_name")
    .on("beforeBrowse", function (data) {
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "code",
        op: "in",
        value1: simpleVOsValue1
      });
      this.setFilter(condition);
    });
}
//初始化调用
viewModel.on("afterLoadData", function (args) {
  const value = viewModel.get("xiangmudangan_code").getValue();
  var girdModel = viewModel.getGridModel();
  ReferCondition(girdModel, value);
});
//调用脚本
viewModel.get("xiangmudangan_name") &&
  viewModel.get("xiangmudangan_name").on("afterValueChange", function (data) {
    // 项目档案--值改变后
    // 编码--值改变后
    const value = viewModel.get("xiangmudangan_code").getValue();
    var girdModel = viewModel.getGridModel();
    //调用过滤参照内容
    ReferCondition(girdModel, value);
  });