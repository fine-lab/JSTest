let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "http://ncc.dowstone.com.cn:8800/nccloud/api/arap/bippaybill/delete";
    let header = { "content-type": "application/json;charset=utf-8" };
    let nccEnv = {
      clientId: "yourIdHere",
      clientSecret: "yourSecretHere",
      pubKey:
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXa9njXSMfbL0r6ZoJ6h0lWn25EIGo6s1OSys4QCRr2ObFIdvUTn+FdIKyUmDsjG4sl9f9mWM9P83c/McoErMo2TP4B7mNnzt98M4OXNDEl2bwkRAD6kCcff6YAF5vb3rkSCQeLOsmFAOge87y46ErshJ/qW6Ge20Cr4nG+Qw2VwIDAQAB",
      userCode: "ncc01",
      username: "ncc01",
      grantType: "client_credentials",
      secretLevel: "L0",
      busiCenter: "A6",
      tokenUrl: "http://ncc.dowstone.com.cn:8800/nccloud/opm/accesstoken",
      old: "true"
    };
    let data = ObjectStore.nccLinker("POST", url, header, request, nccEnv);
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });