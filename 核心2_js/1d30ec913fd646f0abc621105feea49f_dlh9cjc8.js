let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const sql = "select * from GT67226AT13.GT67226AT13.article";
    var res = ObjectStore.queryByYonQL(sql);
    let token = JSON.parse(AppContext()).token;
    let url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/batchFiles`;
    let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
    let attaches = [
      {
        businessId: "yourIdHere", //图片fileid
        objectName: "caep"
      }
    ];
    let body = {
      includeChild: false,
      pageSize: 10,
      batchFiles: JSON.stringify(attaches)
    };
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { res, apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });