viewModel.get("button9nb") &&
  viewModel.get("button9nb").on("click", function (data) {
    // 会计核对入账--单击
    console.log(data);
    var id = viewModel.getGridModel().getRow(data.index).id; //获取选中行数据信息
    let listdata = {
      billtype: "Voucher", // 单据类型
      billno: "cbca33d5", // 单据号
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        //传参
        id: id
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", listdata, viewModel);
  });
viewModel.get("button11pe") &&
  viewModel.get("button11pe").on("click", function (data) {
    // 业务员核对--单击
    console.log(data);
    var id = viewModel.getGridModel().getRow(data.index).id; //获取选中行数据信息
    let listdata = {
      billtype: "Voucher", // 单据类型
      billno: "cbca33d5", // 单据号
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        //传参
        id: id
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", listdata, viewModel);
  });