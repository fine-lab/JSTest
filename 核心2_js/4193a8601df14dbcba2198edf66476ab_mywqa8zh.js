let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.data1.CertificateReceivingContractNo;
    //查询正常的合同有几条
    var sql = "select * from GT8313AT35.GT8313AT35.jjczht where CertificateReceivingContractNo = '" + id + "' and hetongzhuangtai = 1";
    var klt = ObjectStore.queryByYonQL(sql);
    //查询已出证的合同有几条
    var sql1 = "select * from GT8313AT35.GT8313AT35.jjczht where CertificateReceivingContractNo = '" + id + "' and hetongzhuangtai = 4";
    var klt1 = ObjectStore.queryByYonQL(sql1);
    //组装数据
    var zczf = [];
    for (var i = 0; i < klt.length; i++) {
      zczf.push(klt[i]);
    }
    for (var a = 0; a < klt1.length; a++) {
      zczf.push(klt1[a]);
    }
    return { zczf };
  }
}
exports({ entryPoint: MyAPIHandler });