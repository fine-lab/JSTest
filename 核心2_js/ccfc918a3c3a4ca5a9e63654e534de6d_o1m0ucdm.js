viewModel.get("button20qi") &&
  viewModel.get("button20qi").on("click", function (data) {
    // 原合同--单击
    let data = {
      billtype: "Archive", // 单据类型
      billno: "221123000018", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "browse" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel);
  });