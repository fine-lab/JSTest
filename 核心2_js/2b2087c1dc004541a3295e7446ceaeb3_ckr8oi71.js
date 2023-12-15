let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let appContext = AppContext();
    let obj = JSON.parse(appContext);
    let tid = obj.currentUser.tenantId;
    var url = "https://www.example.com/";
    var sql = "select MAX(sql_Id) from AT17604A341D580008.AT17604A341D580008.logs where dr = 0";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (res.length != 0) {
      var sqlId = res[0].sql_Id;
      url = url + "?tenantId=" + tid + "&sqlId=" + sqlId + "";
    }
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {};
    let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    var sqlData = JSON.parse(apiResponse);
    if (sqlData.length == 0) {
      throw new Error("【同步日志查询为空】");
    }
    //新增
    var objectI = [];
    for (var i = 0; i < sqlData.length; i++) {
      var codes = sqlData[i].code;
      if (codes == undefined || codes == "") {
        codes = "";
      }
      var log_information = sqlData[i].logInformation;
      if (log_information == undefined || log_information == "") {
        log_information = "";
      }
      var org_id = sqlData[i].orgId;
      if (org_id == undefined || org_id == "") {
        org_id = "";
      }
      var names = sqlData[i].name;
      if (names == undefined || names == "") {
        names = "";
      }
      var ids = sqlData[i].id;
      if (ids == undefined || ids == "") {
        ids = "";
      }
      var logdata = sqlData[i].logData;
      if (logdata == undefined || logdata == "") {
        logdata = "";
      }
      var pushdates = sqlData[i].pushdate;
      if (pushdates == undefined || pushdates == "") {
        pushdates = "";
      }
      var body = {
        log_code: codes,
        log_information: log_information,
        org_id: org_id,
        names: names,
        sql_Id: ids,
        logDatas: logdata,
        shijian: pushdates
      };
      objectI.push(body);
    }
    //新增
    var resInsert = ObjectStore.insertBatch("AT17604A341D580008.AT17604A341D580008.logs", objectI, "logs");
    return { resInsert };
  }
}
exports({ entryPoint: MyAPIHandler });