viewModel.on("beforeSearch", function (args) {
  debugger;
  var gridModel = viewModel.getGridModel("XunjiadanList");
  //表格动态设置行颜色、列颜色  column:列名 index:行号
  //设置表格列CSS样式
  var user = this.getAppContext().user;
  var userId = user.userId;
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
  commonVOs.push({
    itemName: "caigouid",
    op: "eq",
    value1: userId
  });
  gridModel.on("afterSetDataSource", function (data) {
    debugger;
    var selected = document.querySelectorAll("div[title='无货']");
    if (null != selected) {
      selected.forEach((data) => {
        data.style = data.style.cssText + "; color:red";
        debugger;
      });
    }
    var data1 = data;
    var a = 0;
    var g = gridModel;
    var aa = 1;
  });
});