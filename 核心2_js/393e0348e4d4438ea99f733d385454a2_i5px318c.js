let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    var productcode = data.productcode;
    let orgname = data.orgname;
    var json = {
      data: {
        orgname: orgname,
        productcode: productcode
      }
    };
    let url = "http://ncctest.pilotpen.com.cn:9080/uapws/rest/total/ItemInventory";
    var strResponse = JSON.parse(postman("post", url, null, JSON.stringify(json)));
    if (strResponse.status == 200) {
      return {
        strResponse
      };
    } else {
      return {
        strResponse
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});