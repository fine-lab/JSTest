const gridModel = viewModel.getGridModel();
viewModel.get("decorate_guide_apply_1528489422409433094") &&
  viewModel.get("decorate_guide_apply_1528489422409433094").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    gridModel.on("cellJointQuery", function (params) {
      cb.rest.invokeFunction("https://www.example.com/", { Code: "1" }, function (err, res) {
        throw new Error(JSON.stringify(res));
      });
      let data = {
        billtype: "Voucher", // 单据类型
        billno: "voucher_order", // 单据号
        domainKey: "yourKeyHere",
        params: {
          mode: "add", // (编辑态edit、新增态add、浏览态browse),
          readOnly: true,
          id: params.rowData.sales_order_id
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", data, viewModel);
    });
  });