let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var idNumber = param.data[0].id;
    //查询销售发票自定义项
    let queryHdef = "select define4 from voucher.invoice.SaleInvoiceFreeItem where id=" + idNumber;
    let hdefRes = ObjectStore.queryByYonQL(queryHdef, "udinghuo");
    if (hdefRes.length > 0) {
      //客开发票税号
      let define4Value = hdefRes[0].define4;
      let queryOnlydef = "select id from voucher.invoice.SaleInvoiceFreeItem where define4='" + define4Value + "'";
      let onlyRes = ObjectStore.queryByYonQL(queryOnlydef, "udinghuo");
      if (onlyRes.length > 1) {
        throw new Error("所选用的发票税号已有其他单据引用，请更改！");
      }
      if (onlyRes.length == 1 && onlyRes[0].id != idNumber) {
        throw new Error("所选用的发票税号已有其他单据引用，请更改!");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });