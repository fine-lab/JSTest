let AbstractAPIHandler = require("AbstractAPIHandler");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "14b19c4d2c0746aa912a6e4146a57a7f";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ctx = JSON.parse(AppContext()).currentUser;
    let url = `https://open-api-dbox.yyuap.com/${ctx.tenantId}/commonProductCls/commonProduct/commonapi?appKey=${ENV_KEY}`;
    var p1 = {
      interface: "nc.itf.bip.pub.pfxx.ItfImportToNC",
      method: "impBipToNCDel",
      serviceMethodArgInfo: [
        {
          argType: "java.lang.String",
          argValue: JSON.stringify({
            data: [
              {
                vbdef20: "billcode",
                vbdef8: "billid"
              }
            ],
            code: "200"
          }),
          agg: false,
          isArray: false,
          isPrimitive: false
        }
      ]
    };
    let resp = ublinker("post", url, HEADER_STRING, JSON.stringify(p1));
    return { resp };
  }
}
exports({ entryPoint: MyAPIHandler });