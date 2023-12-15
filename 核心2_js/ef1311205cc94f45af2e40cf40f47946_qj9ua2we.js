let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code; //发货箱编码
    var singture = request.signature; //签收人
    var signatureDate = request.signatureDate; //签收日期
    var specification = request.specification; //规格是否一致
    var signaturePhone = request.signaturePhone; //签名电话
    var openbox = request.openbox; //开箱是否完好
    var handSignatureId = request.handSignatureId; //手工签名id
    var baseUrl = request.baseUrl; //请求地址url
    let token = JSON.parse(AppContext()).token;
    //附件的fileid
    let attach = handSignatureId;
    var updateWrapper = new Wrapper();
    //获取图片公网地址
    let url = `${baseUrl}/iuap-apcom-file/rest/v1/file/mdf/${attach}/files?includeChild=false&ts=13837116323&pageSize=1000`;
    let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
    let body = {};
    let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    updateWrapper.eq("code", code);
    var toUpdate = {
      QianShouRen: singture,
      QianShouDate: signatureDate,
      ShuLiang_Y: specification,
      HuoWu_Y: openbox,
      TuPianBaseURL: baseUrl
    };
    var res = ObjectStore.update("GT37846AT3.GT37846AT3.RZH_11", toUpdate, updateWrapper, "af6531a9");
    return { data: res };
  }
}
exports({ entryPoint: MyAPIHandler });