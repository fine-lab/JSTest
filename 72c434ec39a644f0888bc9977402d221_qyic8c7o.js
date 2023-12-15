viewModel.get("button17pd") &&
  viewModel.get("button17pd").on("click", function (data) {
    // 按钮--单击
    // 按钮--单击
    debugger;
    let data1 = {
      billtype: "Voucher", // 单据类型
      billno: "yb4b32d26e", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "edit", // (卡片页面区分编辑态edit、新增态add、浏览态browse)
        id: "youridHere" //TODO:填写详情id
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.on("customInit", function (data) {
  // 商机回款预测列表--页面初始化
  debugger;
  cb.rest.invokeFunction("AT177016BE17B80006.apiFunction.upOpptMStatus", {}, function (err, res) {});
});