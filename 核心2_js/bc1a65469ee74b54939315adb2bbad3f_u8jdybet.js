window.isAdmin = 0;
viewModel.on("beforeSearch", function (args) {
  console.log("beforeSearch---------------");
  args.isExtend = true;
  args.params.condition.simpleVOs =
    window.isAdmin == "Kewpie(1993)"
      ? [
          {
            logicOp: "and",
            conditions: [
              {
                field: "type",
                op: "eq",
                value1: 1
              }
            ]
          }
        ]
      : [
          {
            logicOp: "and",
            conditions: [
              {
                field: "type",
                op: "eq",
                value1: 1
              },
              {
                field: "creator",
                op: "eq",
                value1: cb.context.getUserId()
              }
            ]
          }
        ];
});
viewModel.get("button22of") &&
  viewModel.get("button22of").on("click", function (data) {
    // 复制--单击
  });
viewModel.get("merchant3_1665913695662768133") &&
  viewModel.get("merchant3_1665913695662768133").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    console.log("beforeSetDataSource----------------------------------");
    data.forEach((it, i) => {
      data[i].item98lb = data[i].lck == 1 ? "新增" : "变更";
    });
  });