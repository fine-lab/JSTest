let AbstractAPIHandler = require("AbstractAPIHandler");
const bip2NccMap = {
  code: "vbillcode",
  sub: {
    sub: "sub1", // 新子表名
    code1: "cc"
  },
  translate: function (bill) {
    Object.keys(this)
      .filter((item) => typeof item == "string" || typeof item == "object")
      .forEach((from) => {
        if (typeof this[from] == "string" && bill[from]) {
          bill[this[from]] = bill[from];
          delete bill[from];
        }
        if (typeof this[from] == "object" && Array.isArray(bill[from])) {
          bill[from].forEach((sitem) => {
            Object.keys(this[from]).forEach((sfrom) => {
              if (sitem[sfrom]) {
                sitem[this[from][sfrom]] = sitem[sfrom];
                delete sitem[sfrom];
              }
            });
          });
          if (this[from][from]) {
            bill[this[from][from]] = bill[from];
            delete bill[from];
          }
        }
      });
  }
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
  tokenUrl: "http://172.23.17.144:22277/nccloud/opm/accesstoken"
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function createNCCCtAr(bill) {
      let url = "http://172.23.17.144:22277/nccloud/api/wmso/newspapersomanage/newspaperso/queryAggNewsPaperSoVO";
      let header = { "content-type": "application/json;charset=utf-8" };
      let body = {};
      let nccEnv = {
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
        tokenUrl: "http://172.23.17.144:22277/nccloud/opm/accesstoken"
      };
      let res = ObjectStore.nccLinker("POST", url, header, body, nccEnv);
      return res;
    }
    let body1 = {
      biz_center: "01",
      grant_type: "client_credentials",
      signature: "e766713ca5dff9b8f8dcae1aa2160f886197452eb304eeecdf82690062a47701",
      client_secret:
        "MmP%2FlUAOvdXPPyDd0P6IoXpeMTixzNhejHVtE55klkZpAEAYPU1mXjMb850LuEgdT8jcPJY25Bji%0D%0AS%2FuzkB9s7YfjqPmoor%2FUBd5HBHUTbyf4thT9IAeD6u2x9he3OEE%2Fb8d3475DrsBonPwTvoVcutX%2F%0D%0A%2FNaiuXk7x94S6pRGIU8%3D",
      client_id: "youridHere",
      userCode: "gxq"
    };
    let header1 = { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" };
    let body = {
      uri: "/nccloud/opm/accesstoken",
      requestBody: JSON.stringify(body1),
      requestHeader: JSON.stringify(header1)
    };
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let strResponse = postman(
      "post",
      "https://www.example.com/",
      JSON.stringify(header),
      JSON.stringify(body)
    );
    return {
      request,
      strResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});