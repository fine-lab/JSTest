viewModel.on("beforeSave", function (data) {
  // 考核组页面详情--保存后事件
  //子表数据
  debugger;
  var gridmodel = viewModel.get("assessment_team_sonList").getAllData();
  for (i = 0; i < gridmodel.length; i++) {
    var psnid = gridmodel[i].psncode;
    for (j = i + 1; j < gridmodel.length; j++) {
      var psnconid = gridmodel[j].psncode;
      if (psnid === psnconid) {
        cb.utils.alert("同一考核组人员不可重复！");
        return false;
      }
    }
  }
});
viewModel.on("customInit", function (data) {
  // 考核组页面详情--页面初始化
});
viewModel.get("assessment_team_sonList") &&
  viewModel.get("assessment_team_sonList").getEditRowModel() &&
  viewModel.get("assessment_team_sonList").getEditRowModel().get("psncode_code") &&
  viewModel
    .get("assessment_team_sonList")
    .getEditRowModel()
    .get("psncode_code")
    .on("blur", function (data) {
      // 人员编码--失去焦点的回调
      debugger;
      var sonalldata = viewModel.get("assessment_team_sonList").getEditRowModel().getAllData();
      //获取修改所在行的索引
      const sonlist = viewModel.getGridModel("assessment_team_sonList");
      const index = sonlist.getFocusedRowIndex();
      //被考核人主键
      var appraisers = sonalldata.psncode;
      cb.rest.invokeFunction(
        "dfc040e71aa142b2913ab38efd6c8d35",
        {
          request: appraisers
        },
        function (err, res) {
          if (err !== null) {
            code = err.code;
            if (code === 999) {
              cb.utils.alert(err.message);
            }
          }
          var psnclId = res.psnclId;
          var psnclname = res.psnclname;
          //获取子表
          var gridsonmodel = viewModel.get("assessment_team_sonList");
          gridsonmodel.setCellValue(index, "psntype", psnclId, true, true);
          gridsonmodel.setCellValue(index, "psntype_name", psnclname, true, true);
          gridsonmodel.setCellValue(index, "psntypename", psnclname, true, true);
        }
      );
    });