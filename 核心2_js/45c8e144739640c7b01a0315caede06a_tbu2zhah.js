let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var type = request.type;
    var role = request.role; //1 收货人 2 库管员 3司机 4销售人员
    var name = request.name;
    var phone = request.phone; //客户电话
    var sql;
    var condition = "";
    if (role == 1) {
      //收货人
      condition += " and receiveContacterPhone = '" + phone + "'";
    } else if (role == 2) {
      //库管员
      condition = " and FaXiangRen = '" + name + "'";
    } else if (role == 3) {
      condition = " and DriverPhone = '" + phone + "'";
    } else if (role == 4) {
      condition = " and YeWuYuan = '" + name + "'";
    }
    if (type == 1) {
      //未发货装箱单
      if (role == 2) {
        sql = "select *,org_id.name from GT37846AT3.GT37846AT3.RZH_11 where WuLiuDanHao = null" + condition + " order by createTime desc";
      } else if (role == 1) {
        //收货人
        sql = "select *,org_id.name from GT37846AT3.GT37846AT3.RZH_11 where WuLiuDanHao = null" + condition1 + " order by createTime desc";
      }
    } else if (type == 2) {
      //运输中装箱单
      sql = "select *,org_id.name from GT37846AT3.GT37846AT3.RZH_11 where QianShouRen = '未签收'" + condition + " order by createTime desc";
    } else if (type == 3) {
      //已签名装箱单
      sql = "select *,org_id.name from GT37846AT3.GT37846AT3.RZH_11 where not QianShouRen = '未签收'" + condition + " order by createTime desc";
    } else if (type == 5) {
      sql = "select *,org_id.name from GT37846AT3.GT37846AT3.RZH_11 where 1 = 1 " + condition + " order by createTime desc";
    }
    var testSql = "select QianShouRen,Fh_code,DriverPhone,QianShouFuJian,QianShouTuPian,FaXiangRen from  GT37846AT3.GT37846AT3.RZH_11";
    var res = ObjectStore.queryByYonQL(sql);
    var res1 = ObjectStore.queryByYonQL(testSql);
    return { data: res, testData: res1 };
  }
}
exports({ entryPoint: MyAPIHandler });