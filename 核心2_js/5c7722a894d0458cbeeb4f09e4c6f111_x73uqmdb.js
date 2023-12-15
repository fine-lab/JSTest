viewModel.get("button11mf") &&
  viewModel.get("button11mf").on("click", function (data) {
    // 按钮--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
    let data2 = {
      billtype: "VoucherList", // 单据类型
      billno: "0b107084", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        a: 1
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data2, viewModel.getCache("parentViewModel"));
  });