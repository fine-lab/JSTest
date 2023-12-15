let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "http://ncc.dowstone.com.cn:8008/nccloud/api/arap/bippaybill/delete";
    let header = { "content-type": "application/json;charset=utf-8" };
    let nccEnv = {
      clientId: "yourIdHere",
      clientSecret: "yourSecretHere",
      pubKey:
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZou7pH9HqTst1zZqrd6LxQ7R1VmcyptxFIN8ETv6dbTS3gmYPXsakWgQcBWWKpQ8tuTiM1JGag1ZAp/9up9Tw0ROHqf2ClT1ZRCzuDsPCUfG7piZku4zbDwTO/fuOdAvzzitEbaZuUFe22YRNhwyzjb/6kEslczkHIvhur79khwIDAQAB",
      userCode: "ncc01",
      username: "ncc01",
      grantType: "client_credentials",
      secretLevel: "L0",
      busiCenter: "001",
      tokenUrl: "http://ncc.dowstone.com.cn:8008/nccloud/opm/accesstoken",
      old: "true"
    };
    let data = ObjectStore.nccLinker("POST", url, header, request, nccEnv);
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });