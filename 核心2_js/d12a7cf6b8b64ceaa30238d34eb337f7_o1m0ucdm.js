viewModel.get("button17gg") &&
  viewModel.get("button17gg").on("click", function (data) {
    let data2 = {
      billtype: "Voucher", // 单据类型
      billno: "yccontract", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        readOnly: true,
        id: 3050020576071939
      }
    };
    cb.loader.runCommandLine("bill", data2, viewModel);
  });