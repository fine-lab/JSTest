viewModel.get("button30vb") &&
  viewModel.get("button30vb").on("click", function (data) {
    // 按钮--单击
    var datarows = viewModel.getGridModel().getSelectedRows();
    var id = datarows[0].id;
    let datanew = {
      billtype: "voucher", // 卡片：voucher
      billno: "voucher_amountrebate", // 卡片页：编码
      params: {
        mode: "edit", // (编辑态、新增态、浏览态)
        id: id
      }
    };
    cb.loader.runCommandLine("bill", datanew, viewModel);
    viewModel.get("button24xg").setVisible(true);
    //刷新
    viewModel.execute("refresh");
    //刷新
    viewModel.biz.do("refresh", viewModel);
  });
viewModel.execute("refresh");
viewModel.biz.do("refresh", viewModel);