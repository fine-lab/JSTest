let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let token = JSON.parse(AppContext()).token;
    //附件的fileid
    let businessId = request.businessId;
    let businessType = request.businessType;
    let ts = new Date().getTime();
    let url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/${businessType}/${businessId}/files?includeChild=false&ts=${ts}&pageSize=10`;
    let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
    let body = {};
    let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    let data = JSON.parse(apiResponse).data;
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });