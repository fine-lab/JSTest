let AbstractAPIHandler = require("AbstractAPIHandler");
const bip2NccMap = {
  code: ""
};
const nccEnv = {
  clientId: "yourIdHere",
  clientSecret: "yourSecretHere",
  pubKey:
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCS5avjb7GbHWNXB5XPC4gJRJHmvwyPMCvyKV6EJ7mq6kjiJBIf+t5Q8guRD41rswF7Nt+hWKs0rnWCc9ypqcTJwtbtHTkjOlD/I7C1KszyEbPT8mBRr0nQd203rfWZ+oKkPl1ENpmlDiNgStRjHZWvZM1ZzPd3yDhHZaUma0iCHwIDAQAB",
  username: "1",
  userCode: "gxq",
  password: "",
  grantType: "client_credentials",
  secretLevel: "L0",
  busiCenter: "01",
  busiId: "",
  repeatCheck: "",
  tokenUrl: "http://58.56.41.39:6066/nccloud/opm/accesstoken"
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "http://58.56.41.39:6066/nccloud/api/wmso/purchasemanage/purchase/deletePurchase";
    let header = { "content-type": "application/json;charset=utf-8" };
    bip2NccMap.code = request.bill.code; //单据号
    let res = ObjectStore.nccLinker("POST", url, header, bip2NccMap, nccEnv);
    return bip2NccMap;
  }
}
exports({ entryPoint: MyAPIHandler });