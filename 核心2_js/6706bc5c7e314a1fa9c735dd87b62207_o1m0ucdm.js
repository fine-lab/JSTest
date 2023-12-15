let x = viewModel.get("beforeid2");
viewModel.get("button21wb") &&
  viewModel.get("button21wb").on("click", function (data) {
    // 采购合同地址--单击
    let data2 = {
      billtype: "Voucher", // 单据类型
      billno: "yccontract", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        readOnly: true,
        id: Number(x.getValue())
      }
    };
    cb.loader.runCommandLine("bill", data2, viewModel);
  });