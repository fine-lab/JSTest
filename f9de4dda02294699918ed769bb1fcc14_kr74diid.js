let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //实体查询
    //条件查询实体
    //失败例子
    var sql = "select id,name,code,pubts,userId from hred.staff.Staff where pubts>='2022-01-01 00:00:00' and code leftlike '010008' ";
    var res = ObjectStore.queryByYonQL(sql, "hrcloud-staff-mgr");
    //原厂单据查询自建单据数据 传参中增加自建的 domainKey: developplatform
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });