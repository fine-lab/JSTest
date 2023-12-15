let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    let configParamsFun = extrequire("GT37595AT2.commonFun.configParamsFun");
    let tokenSql = "select vendorId,appKey,appSecret,appTenantId from GT39745AT6.GT39745AT6.suplierApiMessage";
    var tokenRes = ObjectStore.queryByYonQL(tokenSql);
    const tokenMap = new Map();
    for (var w = 0; w < tokenRes.length; w++) {
      var tokenItem = tokenRes[w];
      tokenMap.set(tokenItem.vendorId, { appKey: tokenItem.appKey, appSecret: tokenItem.appSecret, appTenantId: tokenItem.appTenantId });
    }
    let tk = tokenMap.get("1472052065975926788");
    let ak = tokenMap.get("1472052065975926788").appKey;
    let sk = tokenMap.get("1472052065975926788").appSecret;
    let tid = tokenMap.get("1472052065975926788").appTenantId;
    let header = { appkey: ak, appsecret: sk };
    let body = { xxx: 123 };
    let url2 = "https://www.example.com/";
    let rrr = ublinker("post", url2, JSON.stringify(header), JSON.stringify(body));
    return { res: rrr };
  }
}
exports({ entryPoint: MyTrigger });