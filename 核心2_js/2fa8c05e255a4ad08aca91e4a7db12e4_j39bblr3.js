let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let file = request.file;
    let billId = request.id;
    let url = "http://218.104.237.85:9292/nccloud/api/dzqz/dzqz/dzqz/upload";
    let header = {
      "content-type": "application/json"
    };
    let body = {
      file
    };
    let nccEnv = {
      clientId: "yourIdHere",
      clientSecret: "yourSecretHere",
      pubKey:
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArKO0eda3mmBLTn8WPvHzEgXH8JYd/vMSJItkseJP9xFCDxs36i+KwXz3tmKoAw2nMHvn7SoiyG1pOhCMB9rz5RTijFqf5aKZ/vFCVGxQgcGMFtlWdBMWAfdUcjnEWm+TYKkjvHruMOVMDfg6HC0na+VKp/+RwCSuuNXQEV2nK8XcJ+1yl8MuRHmMBI4/5+XoRtZjW7+3daKkDjW2QKO/rGr9LWBlguIcoU0g4gXRihCXdUQ/RGWlwF7t+b+8UISIVufMvqpX/bY96d5ihW014j3jbq/C8wc1f3A9A+bU4FooK/eKMFPWYemDY8JOt8x9ibjanwal7ZhOwxpTQKokvwIDAQAB",
      grantType: "client_credentials",
      secretLevel: "L0",
      userCode: "NCC",
      busiCenter: "ptcf",
      tokenUrl: "http://218.104.237.85:9292/nccloud/opm/accesstoken"
    };
    let res = ObjectStore.nccLinker("POST", url, header, body, nccEnv);
    var object = { id: billId, extend_fileId: JSON.parse(res.data).info.file1 };
    var res1 = ObjectStore.updateById("check.pucheckbill.PuCheckBillVO", object, "pucheckbilllist");
    return { res };
  }
}
exports({
  entryPoint: MyAPIHandler
});