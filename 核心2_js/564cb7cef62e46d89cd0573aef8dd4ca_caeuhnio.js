viewModel.get("testperson3_xuyn_1732845443821338630") &&
  viewModel.get("testperson3_xuyn_1732845443821338630").on("beforeSetDataSource", function (data) {
    //表格--设置数据源前
    console.log("表格--设置数据源前", data);
  });
viewModel.get("testperson3_xuyn_1732845443821338630") &&
  viewModel.get("testperson3_xuyn_1732845443821338630").on("afterSetDataSource", function (data) {
    //表格--设置数据源前
    console.log("表格--设置数据源后", data);
  });
viewModel.on("customInit", function (data) {
});
viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  filtervm.on("afterInit", function () {
    // 进行查询区相关扩展
    filtervm
      .get("name")
      .getFromModel()
      .on("afterValueChange", function (data) {
        console.log("进行查询区相关扩展", data);
      });
    filtervm
      .get("yungong")
      .getFromModel()
      .on("beforeBrowse", function (data) {
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "code",
          op: "eq",
          value1: "A00004"
        });
        this.setFilter(condition);
      });
  });
});