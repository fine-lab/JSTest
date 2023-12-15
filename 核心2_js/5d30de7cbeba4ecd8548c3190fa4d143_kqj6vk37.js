let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pdata = request.data;
    var ccustomerid = pdata.agentId;
    var object = {
      id: ccustomerid
    };
    var Customerres = ObjectStore.selectById("aa.merchant.Merchant", object);
    if (Customerres != null) {
      var orgid = Customerres.orgId;
      var code = Customerres.code;
      var id = Customerres.id;
      var name = Customerres.name;
      var body = {
        data: {
          createOrg: orgid,
          code: code,
          belongOrg: orgid,
          id: id,
          name: name,
          _status: "Update",
          merchantDefine: {
            id: id,
            define14: "是",
            _status: "Update"
          }
        }
      };
      let func1 = extrequire("SCMSA.backDesignerFunction.getBIPtoken");
      let access_token = func1.execute(request);
      let header = { "Content-type": "application/json" };
      let apiResponse = postman("post", "https://www.example.com/" + access_token, JSON.stringify(header), JSON.stringify(body));
      console.error(JSON.stringify(apiResponse));
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });