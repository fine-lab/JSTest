const gridModel = viewModel.getGridModel();
viewModel.get("decorate_guide_apply_1599688572742926337") &&
  viewModel.get("decorate_guide_apply_1599688572742926337").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    gridModel.on("cellJointQuery", function (params) {
      console.log(params);
      let data;
      if (params.cellName === "sales_order_code") {
        // 打开销售订单单据
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
      } else if (params.cellName === "construction_drawing_code") {
        // 打开施工图图纸
        data = {
          billtype: "Voucher", // 单据类型
          billno: "b06f316a", // 单据号
          domainKey: "yourKeyHere",
          params: {
            mode: "edit", // (编辑态edit、新增态add、浏览态browse),
            readOnly: true,
            id: params.rowData.construction_drawing_ID
          }
        };
      }
      // 打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", data, viewModel);
    });
  });
viewModel.get("decorate_guide_apply_1599688572742926337") &&
  viewModel.get("decorate_guide_apply_1599688572742926337").on("beforeSetDataSource", function (data) {
    // 装修指导申请--设置数据源前
  });
viewModel.get("button25kf") &&
  viewModel.get("button25kf").on("click", function (data) {
    // 修改申请人--单击
    cb.rest.invokeFunction("GT8429AT6.common.modifyData", {}, function (err, res) {
      console.log(res);
    });
  });