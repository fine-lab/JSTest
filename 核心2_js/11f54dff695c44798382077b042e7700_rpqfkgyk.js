const gridModel = viewModel.getGridModel();
viewModel.get("construction_drawing_1529565681071161352") &&
  viewModel.get("construction_drawing_1529565681071161352").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    gridModel.on("cellJointQuery", function (params) {
      console.log(params);
      let data;
      if (params.cellName === "sales_order_code") {
        //打开销售订单单据
        data = {
          billtype: "Voucher", // 单据类型
          billno: "voucher_order", // 单据号
          domainKey: "yourKeyHere",
          params: {
            mode: "add", // (编辑态edit、新增态add、浏览态browse),
            readOnly: true,
            id: params.rowData.sales_order_id
          }
        };
      } else if (params.cellName === "plane_code") {
        //打开平面图单据
        data = {
          billtype: "Voucher", // 单据类型
          billno: "9242e7a0", // 单据号
          domainKey: "yourKeyHere",
          params: {
            mode: "edit", // (编辑态edit、新增态add、浏览态browse),
            readOnly: true,
            id: params.rowData.plane_ID
          }
        };
      } else if (params.cellName === "drawing_code") {
        //打开平面图单据
        data = {
          billtype: "Voucher", // 单据类型
          billno: "b06f316a", // 单据号
          domainKey: "yourKeyHere",
          params: {
            mode: "edit", // (编辑态edit、新增态add、浏览态browse),
            readOnly: true,
            id: params.rowData.id
          }
        };
      }
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", data, viewModel);
    });
  });
viewModel.get("button25id") &&
  viewModel.get("button25id").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("GT8429AT6.common.modifyData", {}, function (err, res) {
      if (res) {
        console.log(res);
      } else if (err) {
        console.log(res);
      }
    });
  });