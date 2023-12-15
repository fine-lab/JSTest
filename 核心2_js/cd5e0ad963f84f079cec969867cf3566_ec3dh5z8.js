let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var idNumber = param.data[0].id;
    //查询特征字段
    let querySale = "select saleInvoiceDefineCharacter from voucher.invoice.SaleInvoice where id='" + idNumber + "'";
    let saleRes = ObjectStore.queryByYonQL(querySale, "udinghuo");
    if (saleRes.length > 0 && saleRes[0].saleInvoiceDefineCharacter.attrext4) {
      //客开发票税号
      let NOMOR_FAKTURId = saleRes[0].saleInvoiceDefineCharacter.attrext4;
      let func1 = extrequire("SCMSA.utils.updateTaxNo");
      let res = func1.execute({ id: NOMOR_FAKTURId, fpzt: "20" });
      if (res.rateresponseobj.code != "200") {
        throw new Error("审核回更自建发票税号状态异常，请检查！" + JSON.stringify(res));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });