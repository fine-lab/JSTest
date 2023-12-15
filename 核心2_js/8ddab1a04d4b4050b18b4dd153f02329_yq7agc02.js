let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取纷享销客token
    var appId = "yourIdHere"; //企业应用ID
    var appSecret = "yourSecretHere"; //企业应用凭证密钥
    var permanentCode = "58CC68B22742AFBC7B727468A806E3D2"; //永久授权码
    var url = "https://www.example.com/"; //获取token网址
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {
      appId: appId,
      appSecret: appSecret,
      permanentCode: permanentCode
    };
    var strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    var strRes = JSON.parse(strResponse);
    var fxxkToken = strRes.corpAccessToken;
    var corpId = strRes.corpId;
    return { fxxkToken, corpId };
  }
}
exports({ entryPoint: MyAPIHandler });