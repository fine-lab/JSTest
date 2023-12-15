let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let packageNo = request.packageNo;
    let itemCode = request.itemCode;
    var requestBody = {};
    requestBody.officeName = "贵州数算互联科技有限公司";
    requestBody.itemCode = itemCode;
    requestBody.packageNo = packageNo;
    let func = extrequire("PU.pubFunciton.configFun");
    let funRes = func.execute();
    // 获取中外运token
    let tokenHeader = { "Content-Type": "application/x-www-form-urlencoded" };
    let tokenUrl = funRes.BASE.tokenUrl + "?userCode=" + funRes.BASE.userCode + "&key=" + funRes.BASE.key + "&sign=" + funRes.BASE.sign;
    let tokenBody = { userCode: funRes.BASE.userCode, key: funRes.BASE.key, sign: funRes.BASE.sign };
    let tokenResponse = postman("post", tokenUrl, JSON.stringify(tokenHeader), JSON.stringify(tokenBody));
    var tokenRes = JSON.parse(tokenResponse);
    //调用中外运库存查询接口
    let apiHeader = { "Content-Type": "application/json", access_token: tokenRes.object.access_token };
    let apiUrl = funRes.BASE.queryInventoryUrl + "?access_token=" + tokenRes.object.access_token;
    let apiResponse = postman("post", funRes.BASE.queryInventoryUrl, JSON.stringify(apiHeader), JSON.stringify(requestBody));
    let apiRes = JSON.parse(apiResponse);
    return { apiRes };
  }
}
exports({ entryPoint: MyAPIHandler });