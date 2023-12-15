viewModel.on("customInit", function (data) {
  //转正员工列表--页面初始化
  var paramAction = viewModel.getParams().action;
  console.log("=====>", paramAction);
  if (paramAction == "pull") {
    viewModel.getGridModel().on("beforeSetDataSource", function (data) {
      for (var i = data.length - 1; i >= 0; i--) {
        // 非已审批的数据过滤掉
        if (data[i].age < 0) {
          // 从 i 位置开始删除 1 个数据
          var num = data.splice(i, 1);
        }
      }
    });
  }
});