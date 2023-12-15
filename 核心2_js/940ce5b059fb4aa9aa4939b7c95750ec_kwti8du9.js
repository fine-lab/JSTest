let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 交易类型id
    var bustype = param;
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 查询交易类型详情
    let bustypeAPI = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/transtype/detail?access_token=" + token + "&id=" + bustype, JSON.stringify(headers), null);
    let BusTypeParse = JSON.parse(bustypeAPI);
    if (BusTypeParse.code == 200) {
      // 交易类型code
      var BusCode = BusTypeParse.data.code;
    }
    return { BusCode: BusCode };
  }
}
exports({ entryPoint: MyTrigger });