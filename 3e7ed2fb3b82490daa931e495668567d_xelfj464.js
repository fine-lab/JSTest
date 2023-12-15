let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
    return {};
  }
}
exports({ entryPoint: MyTrigger });