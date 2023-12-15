let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var idnumber = param.data[0].id;
    var querySql = "select fpzt,fapiaoshuihao from AT1590F01809B00007.AT1590F01809B00007.invoiceTaxNo where id=" + idnumber;
    var res = ObjectStore.queryByYonQL(querySql, "developplatform");
    if (res.length == 0) {
      throw new Error("删除失败，不是最新数据请刷新后重试!");
    }
    var fpztValue = res[0].fpzt;
    var fpcode = res[0].fapiaoshuihao;
    if (fpztValue != "10") {
      throw new Error("删除失败，" + fpcode + "发票状态不可删除!");
    } else {
      //查询销售发票自定义项
      let queryHdef = "select id from voucher.invoice.SaleInvoiceFreeItem where define4=" + idnumber;
      let hdefRes = ObjectStore.queryByYonQL(queryHdef, "udinghuo");
      if (hdefRes.length != 0) {
        throw new Error("删除失败，" + fpcode + "发票已被销售发票引用，不可删除!");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });