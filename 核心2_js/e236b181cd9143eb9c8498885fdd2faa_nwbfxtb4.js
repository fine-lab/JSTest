viewModel.on("customInit", function (data) {
  // 国铁项目单定价工单详情--页面初始化
});
var girdModel = viewModel.getGridModel();
girdModel
  .getEditRowModel()
  .get("wuliaofenleibianma_name")
  .on("beforeBrowse", function (data) {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    //是否停用，否
    condition.simpleVOs.push({
      field: "stopstatus",
      op: "eq",
      value1: false
    });
    //是否删除：否
    condition.simpleVOs.push({
      field: "isDeleted",
      op: "eq",
      value1: false
    });
    this.setFilter(condition);
  });
viewModel.get("managementClass_name") &&
  viewModel.get("managementClass_name").on("afterValueChange", function (data) {
    //产品类别--值改变后
    debugger;
    const alldata = viewModel.getAllData();
    cb.rest.invokeFunction("0af6d0af4e864344856a35d2379abc9a", { data: alldata }, function (err, res) {
      if (res != undefined) {
        var kaifarenid = res.resyuangong[0].id;
        var kaifarenmc = res.resyuangong[0].name;
        viewModel.get("kaifaren").setValue(kaifarenid);
        viewModel.get("kaifaren_name").setValue(kaifarenmc);
      } else {
        viewModel.get("kaifaren").setValue("");
        viewModel.get("kaifaren_name").setValue("");
      }
    });
  });