let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //实体查询
    throw new Error(JSON.stringify(param));
    let url = "http://218.104.237.85:8001/nccloud/api/so/saleorder/save";
    let header = { "content-type": "application/json;charset=utf-8" };
    let body = {};
    let nccEnv = {
      clientId: "yourIdHere",
      clientSecret: "yourSecretHere",
      pubKey:
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArKO0eda3mmBLTn8WPvHzEgXH8JYd/vMSJItkseJP9xFCDxs36i+KwXz3tmKoAw2nMHvn7SoiyG1pOhCMB9rz5RTijFqf5aKZ/vFCVGxQgcGMFtlWdBMWAfdUcjnEWm+TYKkjvHruMOVMDfg6HC0na+VKp/+RwCSuuNXQEV2nK8XcJ+1yl8MuRHmMBI4/5+XoRtZjW7+3daKkDjW2QKO/rGr9LWBlguIcoU0g4gXRihCXdUQ/RGWlwF7t+b+8UISIVufMvqpX/bY96d5ihW014j3jbq/C8wc1f3A9A+bU4FooK/eKMFPWYemDY8JOt8x9ibjanwal7ZhOwxpTQKokvwIDAQAB",
      grantType: "client_credentials",
      secretLevel: "L0",
      userCode: "dengyq",
      busiCenter: "NCC2111",
      tokenUrl: "http://218.104.237.85:8001/nccloud/opm/accesstoken"
    };
    let res = ObjectStore.nccLinker("POST", url, header, body, nccEnv);
    return {};
  }
}
exports({ entryPoint: MyTrigger });