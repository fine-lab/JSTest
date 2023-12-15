let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var idnumber = param.data[0].id;
    if (idnumber != null) {
      //编辑
      //查询销售发票自定义项
      let queryHdef = "select status from voucher.invoice.SaleInvoice where saleInvoiceDefineCharacter.attrext4 ='" + idnumber + "'";
      let hdefRes = ObjectStore.queryByYonQL(queryHdef, "udinghuo");
      if (hdefRes.length != 0) {
        //被销售发票引用
        if (hdefRes[0].status != "0" && hdefRes[0].status != "3") {
          throw new Error("保存失败，引用此税号的销售发票已审核通过不可修改!");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });