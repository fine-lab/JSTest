let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var alldata = request.data[0];
    var sonId = alldata.id;
    var sonSql = "select * from AT17604A341D580008.AT17604A341D580008.CostSharingTable where sharingEntity_id ='" + sonId + "' and dr = 0";
    var sonRes = ObjectStore.queryByYonQL(sonSql, "developplatform");
    if (sonRes.length != 0) {
      var sonResultAll = sonRes[0];
    }
    //数据库编码
    var code = "AT17604A341D580008.AT17604A341D580008.sharingEntity";
    let url = "https://www.example.com/" + code;
    return { sonResultAll };
  }
}
exports({ entryPoint: MyAPIHandler });