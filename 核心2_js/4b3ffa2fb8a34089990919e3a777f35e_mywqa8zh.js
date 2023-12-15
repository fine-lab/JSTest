let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.data1.CertificateReceivingContractNo;
    //作废的数据有几条
    var sql1 = "select * from GT8313AT35.GT8313AT35.jjczht where CertificateReceivingContractNo = '" + id + "' and hetongzhuangtai = 1";
    var pon1 = ObjectStore.queryByYonQL(sql1);
    //过期的数据有几条
    var sql2 = "select * from GT8313AT35.GT8313AT35.jjczht where CertificateReceivingContractNo = '" + id + "' and hetongzhuangtai = 4";
    var pon2 = ObjectStore.queryByYonQL(sql2);
    //完结的数据有几条
    var sql3 = "select * from GT8313AT35.GT8313AT35.jjczht where CertificateReceivingContractNo = '" + id + "' and hetongzhuangtai = 8";
    var pon3 = ObjectStore.queryByYonQL(sql3);
    var body = [];
    for (var i = 0; i < pon1.length; i++) {
      body.push(pon1[i]);
    }
    for (var a = 0; a < pon2.length; a++) {
      body.push(pon2[a]);
    }
    for (var n = 0; n < pon3.length; n++) {
      body.push(pon3[n]);
    }
    return { body };
  }
}
exports({ entryPoint: MyAPIHandler });