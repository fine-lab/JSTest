let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //客户id
    let data = request.data;
    var agentId = data.value.id;
    var kehusql = "select * from aa.merchant.Merchant where id = '" + agentId + "'";
    var res = ObjectStore.queryByYonQL(kehusql, "productcenter");
    var orgId = res[0].orgId;
    //调用客户档案url
    let url1 = "https://www.example.com/" + agentId + "&agentId=" + orgId;
    //调用openlinker客户档案
    var kehudangan1 = openLinker("GET", url1, "SCMSA", JSON.stringify({}));
    var kehuAll = JSON.parse(kehudangan1);
    if (kehuAll.code == 200 && kehuAll.data != null) {
      var receiver = kehuAll.data.merchantAddressInfos != undefined ? kehuAll.data.merchantAddressInfos[0].receiver : "";
      var mobile = kehuAll.data.merchantAddressInfos != undefined ? kehuAll.data.merchantAddressInfos[0].mobile : "";
      var address = kehuAll.data.merchantAddressInfos != undefined ? kehuAll.data.merchantAddressInfos[0].address : "";
    }
    let resData = {
      receiver: receiver,
      mobile: mobile,
      address: address
    };
    return { resData };
  }
}
exports({ entryPoint: MyAPIHandler });