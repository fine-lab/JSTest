let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var org_id = request.org_id;
    var csaleinvoiceid = request.csaleinvoiceid;
    var invoice_vbillcode = request.invoice_vbillcode;
    var accbook = request.accbook;
    var voucherid = request.voucherid;
    var vouchcode = request.vouchcode; //凭证号
    var vouindex = request.vouindex; //凭证生成顺序
    var object = {
      org_id: org_id,
      csaleinvoiceid: csaleinvoiceid,
      invoice_vbillcode: invoice_vbillcode,
      accbook: accbook,
      voucherid: voucherid,
      vouindex: vouindex,
      vouchcode: vouchcode
    };
    var res = ObjectStore.insert("AT169CA8FC09A00003.AT169CA8FC09A00003.pushVoucherLog", object, "ce9ee8c9");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });