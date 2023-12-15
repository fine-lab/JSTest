viewModel.on("customInit", function (data) {
  // 权限发布参照--页面初始化
  var viewModel = this;
  viewModel.get("name").on("beforeBrowse", function (args) {
    //主要代码
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "org_id_name",
      op: "eq",
      value1: "云南煤炭集团"
    });
    //设置过滤条件
    this.setFilter(condition);
  });
});