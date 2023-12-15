let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var type = request.type;
    var role = request.role; //1 收货人 2 装箱人
    var phone = request.phone; //客户电话
    var sql;
    var condition = "";
    if (role == 1) {
      //收货人
      condition += " and receiveContacterPhone = '" + phone + "'";
    } else if (role == 2) {
      //发箱人
    }
    if (type == 1) {
      //未发货装箱单
      if (role == 2) {
        sql = "select * from GT37846AT3.GT37846AT3.RZH_11 where WuLiuDanHao = null" + condition + " order by createTime desc";
      } else if (role == 1) {
        //收货人
        sql = "select * from GT37846AT3.GT37846AT3.RZH_11 where WuLiuDanHao = null" + condition1 + " order by createTime desc";
      }
    } else if (type == 2) {
      //运输中装箱单
      sql = "select * from GT37846AT3.GT37846AT3.RZH_11 where not WuLiuDanHao = null and  QianShouRen = '未签收'" + condition + " order by createTime desc";
    } else if (type == 3) {
      //已签名装箱单
      sql = "select * from GT37846AT3.GT37846AT3.RZH_11 where not QianShouRen = '未签收'" + condition + " order by createTime desc";
    } else {
      sql = "select * from GT37846AT3.GT37846AT3.RZH_11" + condition + " order by createTime desc";
    }
    var testSql = "select QianShouRen,Fh_code, QianShouFuJian,QianShouTuPian from  GT37846AT3.GT37846AT3.RZH_11";
    var res = ObjectStore.queryByYonQL(sql);
    var res1 = ObjectStore.queryByYonQL(testSql);
    return { data: res, testData: res1 };
  }
}
exports({ entryPoint: MyAPIHandler });