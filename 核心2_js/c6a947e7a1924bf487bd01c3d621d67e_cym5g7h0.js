let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "http://172.20.59.50:2007/nccloud/api/ct/saledaily/savebase";
    var header = { "content-type": "application/json;charset=utf-8" };
    var body = [param];
    console.error(JSON.stringify(param.data));
    //查询内容
    var object = {
      id: param.data[0].id
    };
    //实体查询
    var select = ObjectStore.selectById("sact.contract.SalesContract", object);
    console.error(JSON.stringify(select));
    //请求头
    let apiHeader = { appkey: "yourkeyHere", appsecret: "yoursecretHere" };
    let apiBody = {};
    let apiUrl = "https://www.example.com/";
    let apiResponse = ublinker("GET", apiUrl, JSON.stringify(apiHeader), JSON.stringify(apiBody));
    console.error(JSON.stringify(apiResponse));
    var nccEnv = {
      clientId: "yourIdHere",
      clientSecret: "yourSecretHere",
      pubKey:
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCS5avjb7GbHWNXB5XPC4gJRJHmvwyPMCvyKV6EJ7mq6kjiJBIf+t5Q8guRD41rswF7Nt+hWKs0rnWCc9ypqcTJwtbtHTkjOlD/I7C1KszyEbPT8mBRr0nQd203rfWZ+oKkPl1ENpmlDiNgStRjHZWvZM1ZzPd3yDhHZaUma0iCHwIDAQAB",
      username: "gjx",
      usercode: "gjx",
      password: "yourpasswordHere",
      grantType: "password",
      secretLevel: "L0",
      busiCenter: "pre2005",
      busiId: "",
      repeatCheck: "",
      old: "true",
      tokenUrl: "http://172.20.59.50:2007/nccloud/opm/accesstoken"
    };
    debugger;
    var res = nccLinker("POST", url, JSON.stringify(header), JSON.stringify(body), JSON.stringify(nccEnv));
    return { res };
  }
}
exports({ entryPoint: MyTrigger });