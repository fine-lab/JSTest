let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取客户信息
    let Id = request.Id;
    let result = {};
    let sql = "select customerIndustry industry,merchantDefine.define16 ywgs,merchantDefine.define15 hybm from aa.merchant.Merchant where id='" + Id + "'";
    let res = ObjectStore.queryByYonQL(sql, "productcenter");
    if (res.length > 0) {
      result = {
        industry: res[0].industry,
        ywgs: res[0].ywgs,
        hybm: res[0].hybm
      };
    }
    return {
      result
    };
  }
}
exports({ entryPoint: MyAPIHandler });