viewModel.on("customInit", function (data) {
});
const gridModel = viewModel.getGridModel();
viewModel.get("extend_client_refund_apply_1602246560763084800") &&
  viewModel.get("extend_client_refund_apply_1602246560763084800").on("afterSetDataSource", function (data) {
    // 客户退款单编号--值改变
    gridModel.on("cellJointQuery", function (params) {
      if ((params.cellName = "client_refund_code")) {
        let data = {
          billtype: "Voucher", // 单据类型
          billno: "arap_paybill", // 单据号
          domainKey: "yourKeyHere",
          params: {
            mode: "browse", // (编辑态edit、新增态add、浏览态browse),
            readOnly: true,
            id: params.rowData.client_refund_id
          }
        };
        //打开一个单据，并在当前页面显示
        cb.loader.runCommandLine("bill", data, viewModel);
      }
    });
  });