let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(content, param) {
    var header = {
      "content-type": "application/json;charset=utf-8"
    };
    var body = {};
    var url = "http://172.20.53.36:8081/nccloud/api/riawf/workflow/pass/approve";
    body.reject_activity = "0";
    body.transType = "1";
    body.billId = "2";
    body.pk_checkflow = "3";
    body.checkman = "4";
    body.checknote = "5";
    var nccEnv = {
      clientId: "ssc",
      clientSecret: "yourSecretHere",
      pubKey:
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0T0rM8NJAfs9oOIz/uKqFw6bArVQPBojKtxEykNPo+yZZXaZDyF6s7AlDbPUIfmd112xK5h2gFDllJnUrUmwALSGZrPLhFz73rTgIzywmoVN95sPGsLqKh69ShIxptji+OrrIuVJW6RrhcgAaje9JAIokhtsxAZLglRfNDzrzWjqccdijAY7n4OsMK2lAm9Dnwbc0NIbSvUAQ7qtZDX5CVdHXg+Q+60BePzPVVTVY7xFnTIf5+vu9Esf6AOQl1QaB7AKjLwFsKfVoC6yuVI2lrKb0wyxyPZQcuu9ixG/uzJb8dMJttqqG1R1R9LaHBL9xv2iuIMFeRL9nsQNQotJjwIDAQAB",
      username: "1",
      userCode: "",
      password: "yourpasswordHere",
      grantType: "password",
      secretLevel: "L0",
      busiCenter: "ncc2021.11",
      busiId: "",
      repeatCheck: "",
      tokenUrl: "http://172.20.53.36:8081/nccloud/opm/accesstoken"
    };
    var res = ObjectStore.nccLinker("POST", url, header, body, nccEnv);
    return {
      res
    };
  }
}
exports({
  entryPoint: MyTrigger
});