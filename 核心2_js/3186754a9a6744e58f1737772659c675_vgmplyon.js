viewModel.get("zhiliangpingfenqingkuangCardTableTable") &&
  viewModel.get("zhiliangpingfenqingkuangCardTableTable").getEditRowModel() &&
  viewModel.get("zhiliangpingfenqingkuangList").getEditRowModel().get("zhiliangfen") &&
  viewModel
    .get("zhiliangpingfenqingkuangList")
    .getEditRowModel()
    .get("zhiliangfen")
    .on("blur", function (data) {
      // 质量得分--失去焦点的回调
      console.log("--------------");
      var rowModel = viewModel.get("zhiliangpingfenqingkuangList");
      const value = rowModel.getCellValue("zhiliangfen");
      console.log(value);
      console.log("++++++++++++++");
    });
viewModel.get("zhiliangpingfenqingkuangList") &&
  viewModel.get("zhiliangpingfenqingkuangList").getEditRowModel() &&
  viewModel.get("zhiliangpingfenqingkuangList").getEditRowModel().get("zhiliangfen") &&
  viewModel
    .get("zhiliangpingfenqingkuangList")
    .getEditRowModel()
    .get("zhiliangfen")
    .on("valueChange", function (data) {
      // 质量得分--值改变
      console.log("-------值改变-------");
      var rowModel = viewModel.get("zhiliangpingfenqingkuangList");
      const value = rowModel.getCellValue("zhiliangfen");
      console.log(value);
      console.log("+++++++值改变+++++++");
    });