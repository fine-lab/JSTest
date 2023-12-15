viewModel.get("supervisoryStaff_name").on("beforeBrowse", function (args) {
  debugger;
  let branch = viewModel.get("branch").getValue();
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "mainJobList.dept_id",
    op: "eq",
    value1: branch
  });
  let ad = ["科长", "队长"];
  condition.simpleVOs.push({
    field: " mainJobList.post_id.name",
    op: "in",
    value1: ad
  });
  this.setFilter(condition);
});
viewModel.get("advanceInformationSheetDetailList") &&
  viewModel.get("advanceInformationSheetDetailList").getEditRowModel() &&
  viewModel.get("advanceInformationSheetDetailList").getEditRowModel().get("productionWorkNumber_productionWorkNumber") &&
  viewModel
    .get("advanceInformationSheetDetailList")
    .getEditRowModel()
    .get("productionWorkNumber_productionWorkNumber")
    .on("afterValueChange", function (data) {
      // 生产工号--值改变
      debugger;
      //获取预支类型
      var advanceType = viewModel.__data.advanceType.__data.value;
      var gridModel = viewModel.getGridModel("advanceInformationSheetDetailList");
      var dataSource = gridModel.__data.dataSource;
      if (dataSource.length > 0) {
        for (var i = 0; i < dataSource.length; i++) {
          // 生产工号名字
          var productionWorkNumber_productionWorkNumber = dataSource[i].productionWorkNumber_productionWorkNumber;
          // 生产工号id
          var productionWorkNumber = dataSource[i].productionWorkNumber;
          if (productionWorkNumber_productionWorkNumber != null) {
            var ss = cb.rest.invokeFunction(
              "GT102917AT3.API.advanceAmount",
              { SC: productionWorkNumber_productionWorkNumber, advanceType: advanceType, SCNOid: productionWorkNumber },
              function (err, res) {},
              viewModel,
              { async: false }
            );
            var flag = ss.result.res;
          }
        }
      }
    });