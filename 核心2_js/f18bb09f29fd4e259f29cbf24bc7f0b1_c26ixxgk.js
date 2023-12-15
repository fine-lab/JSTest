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
      let func1 = extrequire("SCMSA.utils.updateTaxNo");
      let res = func1.execute({ id: define4Value, fpzt: "99" });
      if (res.rateresponseobj.code != "200") {
        throw new Error("作废回更自建发票税号状态异常，请检查！" + JSON.stringify(res));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });