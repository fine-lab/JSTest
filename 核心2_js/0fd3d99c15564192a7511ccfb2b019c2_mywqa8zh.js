viewModel.on("customInit", function (data) {
  debugger;
  // 现存量表--页面初始化
  var XianCun1 = viewModel.getParams().XianCun1;
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    var conditions = args.params.condition;
    conditions.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "product",
            op: "eq",
            value1: XianCun1
          }
        ]
      }
    ];
  });
});
viewModel.get("button11mk") &&
  viewModel.get("button11mk").on("click", function (data) {
    // 确定--单击
    var girdModel = viewModel.getGridModel();
    // 获取grid中已选中行的数据
    const extant = girdModel.getSelectedRows();
    let extant1 = extant[0].currentqty;
    let usable1 = extant[0].availableqty;
    let CangkuId = extant[0].warehouse;
    let Cangku = extant[0].warehouse_name;
    var parentViewModel = viewModel.getCache("parentViewModel");
    var model = parentViewModel.getGridModel();
    var rows = parentViewModel.getGridModel().getSelectedRowIndexes();
    model.setCellValue(rows, "xiancunliang", extant1);
    model.setCellValue(rows, "keyongliang", usable1);
    model.setCellValue(rows, "diaochucangku", CangkuId);
    model.setCellValue(rows, "diaochucangku_name", Cangku);
    viewModel.communication({ type: "modal", payload: { data: false } });
  });