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
            mode: "edit", // (编辑态edit、新增态add、浏览态browse),
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
      }
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", data, viewModel);
    });
  });
viewModel.get("button39ub").on("click", (params) => {
  let args = {
    cCaption: "拉单",
    cmdParameter:
      '{"originBusiCode":"udinghuo.voucher_order","targetBusiCode":"b06f316a","domain":"developplatform","targetBillType":0,"billnumber":"9669cf2b","targetBillNo":"b06f316a","busiObj":"udinghuo.voucher_order","showConvertedBill":true,"targetServiceCode":"","sourceBillNo":"voucher_order","businessFlowId":"cac275d3-290e-11ed-9896-6c92bf477043","tenantId":"f40nktis","ruleId":"e56b070d-3fec-11ed-9896-6c92bf477043","sourceDomain":"udinghuo","targetDomain":"developplatform","targetDomainKey":"developplatform"}'
  };
  viewModel.biz.do("pullx", viewModel, args);
});