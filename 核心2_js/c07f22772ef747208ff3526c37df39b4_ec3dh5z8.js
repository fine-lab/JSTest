let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var idNumber = param.data[0].id;
    //租户id
    let tenantId = ObjectStore.user().tenantId;
    //查询特征字段
    let querySale = "select saleInvoiceDefineCharacter from voucher.invoice.SaleInvoice where id='" + idNumber + "'";
    let saleRes = ObjectStore.queryByYonQL(querySale, "udinghuo");
    if (saleRes.length > 0 && saleRes[0].saleInvoiceDefineCharacter.attrext4) {
      //客开发票税号
      let NOMOR_FAKTURId = saleRes[0].saleInvoiceDefineCharacter.attrext4;
      //查询发票自定义项特征实体
      let queryOnlydef = "select id from voucher.invoice.SaleInvoiceDefineCharacter where ytenant='" + tenantId + "' and attrext4='" + NOMOR_FAKTURId + "'";
      let onlyRes = ObjectStore.queryByYonQL(queryOnlydef, "udinghuo");
      if (onlyRes.length > 1) {
        throw new Error("所选用的发票税号已有其他单据引用，请更改！");
      }
      if (onlyRes.length == 1 && onlyRes[0].id != saleRes[0].saleInvoiceDefineCharacter.id) {
        throw new Error("所选用的发票税号已有其他单据引用，请更改!");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });