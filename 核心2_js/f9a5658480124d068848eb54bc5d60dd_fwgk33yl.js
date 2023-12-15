let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    let contractId = request.contractId;
    let contractName = request.contractName;
    let url = "https://www.example.com/";
    let appKey = "yourKeyHere";
    let accessToken = "yourTokenHere";
    let resultType = "json";
    let param = "&email=" + currentUser.email; //yanglic;
    param += "&Sort=contractId";
    param += "&PageIndex=1";
    param += "&PageSize=50";
    param += "&CorpIdentifier=345CF12F6E1523C5";
    if (contractId) {
      param += "&contractId=" + contractId;
    }
    if (contractName) {
      param += "&contractName=" + contractName;
    }
    let timestamp = parseInt(new Date().getTime() / 1000);
    var oauth = MD5Encode(appKey + timestamp + accessToken);
    let callUrl = url + "?oauth=" + oauth + "&appKey=" + appKey + "&timestamp=" + timestamp + "&resultType=" + resultType + param;
    var strResponse = postman("get", callUrl, null, null);
    return JSON.parse(strResponse);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });