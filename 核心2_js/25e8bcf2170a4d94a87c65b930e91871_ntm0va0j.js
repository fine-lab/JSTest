let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code; //发货箱编码
    var sql = "select HandSignatureId,TuPianBaseURL from  GT37846AT3.GT37846AT3.RZH_11 where code =" + code + "";
    var res1 = ObjectStore.queryByYonQL(sql);
    var handSignatureId = res1[0].HandSignatureId; //手工签名
    var baseUrl = res1[0].TuPianBaseURL; //请求地址url
    //获取图片公网地址
    let attach = handSignatureId;
    let url = `${baseUrl}/iuap-apcom-file/rest/v1/file/mdf/${attach}/files?includeChild=false&ts=13837116323&pageSize=1000`;
    let token = JSON.parse(AppContext()).token;
    let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
    let body = {};
    let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("code", code);
    let signagureImageUrl = apiResponse.data[0].filePath;
    var toUpdate = {
      QianShouTuPianLink: signagureImageUrl
    };
    var res = ObjectStore.update("GT37846AT3.GT37846AT3.RZH_11", toUpdate, updateWrapper, "af6531a9");
    return { signagureImageUrl: signagureImageUrl };
  }
}
exports({ entryPoint: MyAPIHandler });