let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql = "select enclosure from GT8429AT6.GT8429AT6.extend_client_refund_apply where id = '" + request.id + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res) {
      if (res[0].enclosure) {
        let requestUrl = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/iuap-yonbuilder-runtime+mdf/mdf_${res[0].enclosure}/files?authId=1609570364759212034&domainApp=iuap-yonbuilder-runtime+mdf&authFix=936408ceList&buttonCode=ifile_list&fromDevice=web&pageSize=10000&groupId=&columnId=&pageNo=1&isGroupIncludeChild=false&fileName=`;
        let requestMethod = "GET";
        let body = {};
        let header = {};
        let apiResponse = postman(requestMethod, requestUrl, JSON.stringify(header), JSON.stringify(body));
        var result = JSON.parse(apiResponse);
        var data = result.data;
        return {
          data
        };
      }
    }
    return {
      res
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});