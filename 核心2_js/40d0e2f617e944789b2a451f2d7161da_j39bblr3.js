let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    throw new Error(JSON.stringify(request.data));
    let url = "http://192.168.1.128:8001/nccloud/api/imag/demimag/imagconfig/getnccserverinfo";
    let header = { "content-type": "application/json;charset=utf-8" };
    let body = {
      pk_group: ""
    };
    let nccEnv = {
      clientId: "yourIdHere",
      clientSecret: "yourSecretHere",
      pubKey:
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArKO0eda3mmBLTn8WPvHzEgXH8JYd/vMSJItkseJP9xFCDxs36i+KwXz3tmKoAw2nMHvn7SoiyG1pOhCMB9rz5RTijFqf5aKZ/vFCVGxQgcGMFtlWdBMWAfdUcjnEWm+TYKkjvHruMOVMDfg6HC0na+VKp/+RwCSuuNXQEV2nK8XcJ+1yl8MuRHmMBI4/5+XoRtZjW7+3daKkDjW2QKO/rGr9LWBlguIcoU0g4gXRihCXdUQ/RGWlwF7t+b+8UISIVufMvqpX/bY96d5ihW014j3jbq/C8wc1f3A9A+bU4FooK/eKMFPWYemDY8JOt8x9ibjanwal7ZhOwxpTQKokvwIDAQAB",
      grantType: "client_credentials",
      secretLevel: "L0",
      userCode: "dengyq",
      busiCenter: "NCC2111",
      tokenUrl: "http://192.168.1.128:8001/nccloud/opm/accesstoken"
    };
    let res = ObjectStore.nccLinker("POST", url, header, body, nccEnv);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });