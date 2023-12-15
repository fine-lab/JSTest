window.isAdmin = 0;
viewModel.on("beforeSearch", function (args) {
  console.log("beforeSearch---------------");
  args.isExtend = true;
  args.params.condition.simpleVOs =
    window.isAdmin == 1
      ? null
      : [
          {
            logicOp: "and",
            conditions: [
              {
                field: "creator",
                op: "eq",
                value1: cb.context.getUserId()
              }
            ]
          }
        ];
});
viewModel.get("btnEdit") &&
  viewModel.get("btnEdit").on("click", function (data) {
    //编辑--单击
    let gm = viewModel.getGridModel();
    let row = gm.getRow(gm.getFocusedRowIndex());
    let JSONdata = JSON.parse(row.data);
    let info = {
      billtype: "voucher", // 单据类型
      billno: "ybff7b95d3", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "edit",
        data: JSONdata
      }
    };
    cb.loader.runCommandLine("bill", info, viewModel);
  });