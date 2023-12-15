const gridModel = viewModel.getGridModel();
viewModel.get("pre_buriedwire_deliveryapply_1529544773175607297") &&
  viewModel.get("pre_buriedwire_deliveryapply_1529544773175607297").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    gridModel.on("cellJointQuery", function (params) {
      let sales_order_code = params.rowData.sales_order_code;
      let sales_order_id = params.rowData.sales_order_id;
      console.log(`sales_order_code --- ${sales_order_code}`);
      console.log(`sales_order_id --- ${sales_order_id}`);
      if ((params.cellName = "sales_order_code")) {
        let data = {
          billtype: "Voucher", // 单据类型
          billno: "voucher_order", // 单据号
          domainKey: "yourKeyHere",
          params: {
            mode: "edit", // (编辑态edit、新增态add、浏览态browse),
            readOnly: true,
            id: sales_order_id
          }
        };
        console.log(`data --- ${JSON.stringify(data)}`);
        //打开一个单据，并在当前页面显示
        cb.loader.runCommandLine("bill", data, viewModel);
      }
    });
  });