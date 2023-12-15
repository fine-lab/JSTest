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
    var isMobileSignature = request.isMobileSignature; //是否手机签名 0 否 1是
    var isUploadPhotoList = request.isUploadPhotoList; //是否上传图片列表
    var ChaYiType = request.ChaYiType; //差异类型
    var QianShouNum = request.QianShouNum; //签收数量
    var QianShouMemo = request.QianShouMemo; //签收建议
    let token = JSON.parse(AppContext()).token;
    //附件的fileid
    let attach = handSignatureId;
    var updateWrapper = new Wrapper();
    debugger;
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
      ChaYiType: ChaYiType,
      QianShouNum: QianShouNum,
      QianShouMemo: QianShouMemo,
      QianShouTuPianLink: null,
      HandSignatureId: null,
      TuPianBaseURL: baseUrl
    };
    if (isMobileSignature == 1) {
      if (apiResponse.data[0].filePath != undefined) {
        let signatureImageUrl = apiResponse.data[0].filePath;
        toUpdate.QianShouTuPianLink = signatureImageUrl;
        toUpdate.HandSignatureId = handSignatureId;
      }
    }
    var res = ObjectStore.update("GT37846AT3.GT37846AT3.RZH_11", toUpdate, updateWrapper, "af6531a9");
    return { data: res, apiResponse: apiResponse, toUpdate: toUpdate, request: request };
  }
}
exports({ entryPoint: MyAPIHandler });