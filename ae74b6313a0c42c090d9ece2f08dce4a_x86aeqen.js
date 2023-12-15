viewModel.on("customInit", function (data) {
  // 虚拟实体表格详情--页面初始化
  console.log(viewModel.getGridModel());
  var table = viewModel.getGridModel();
  table.on("cellJointQuery", function (args) {
    if (args.cellName == "liushuihao") {
      console.log("https://www.example.com/" + args.row.liushuihao);
      viewModel.communication({
        type: "modal",
        payload: {
          mode: "inner",
          groupCode: "modal15pg",
          viewModel: viewModel,
          data: { daokuanjine: args.row.daokuanjine }
        }
      });
    }
  });
  cb.rest.invokeFunction("AT17C25B1016C00003.api.gridData", {}, function (err, res) {
    console.log(res);
    res.res.forEach((item) => {
      console.log(item);
      table.appendRow(item);
    });
  });
});
viewModel.get("button131ue") &&
  viewModel.get("button131ue").on("click", function (data) {
    // 确认--单击
  });