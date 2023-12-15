viewModel.get("button27ne") &&
  viewModel.get("button27ne").on("click", function (data) {
    let x = viewModel.get("beforeid2");
    console.log(Number(x.getValue()));
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
viewModel.on("afterBizflowpush", (data) => {
  console.log("afterBizflowpush");
  viewModel.execute("refresh");
});