let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let from_account = param.from_account; //#调用方id
    let to_account = param.to_account; //#提供方id
    let app_key = param.app_key; //#应用key
    let app_secret = param.app_secret; //#应用密钥
    let token = param.accessToken;
    let paramKey = param.urlKey;
    let api_url_trade_get = "https://www.example.com/" + from_account + "&app_key=" + app_key + "&token=" + token; //#获取trade_id 的url
    let api_url_orderstatus_get = "https://www.example.com/" + from_account + "&to_account=" + to_account + "&app_key=" + app_key + "&token=" + token; //#获取orderstatus的url
    let api_url_result_get = "https://api.yonyouup.com/result?requestid={requestid}"; //#获取结果的url
    if (paramKey == "api_url_trade_get") {
      return api_url_trade_get;
    } else if (paramKey == "api_url_orderstatus_get") {
      return api_url_orderstatus_get;
    } else if (paramKey == "api_url_result_get") {
      return api_url_result_get;
    }
    return "";
  }
}
exports({ entryPoint: MyTrigger });