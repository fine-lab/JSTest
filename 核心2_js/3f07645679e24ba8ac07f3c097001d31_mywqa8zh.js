let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let param = context;
    let busiObjCode = "AT175542E21C400007.AT175542E21C400007.payBusObject";
    let busiid = param.return.id;
    let srcBillVersion = param.return.srcBillVersion;
    if (null !== srcBillVersion && !"" == srcBillVersion) {
      let deleteurl = "https://www.example.com/" + busiObjCode;
      let body = {
        srcBusiId: busiid,
        srcBillVersion: srcBillVersion
      };
      let deleteapiResponse1 = openLinker("POST", deleteurl, "AT175542E21C400007", JSON.stringify(body));
    }
    let inserturl = "https://www.example.com/" + busiObjCode;
    let apiResponse = openLinker("POST", inserturl, "AT175542E21C400007", JSON.stringify(param.return));
    let resrcBillVersion = "";
    if (JSON.parse(apiResponse).code == "200") {
      resrcBillVersion = JSON.parse(apiResponse).eventInfo.srcBillVersion;
      var object = { id: busiid, srcBillVersion: resrcBillVersion + "" };
      var res = ObjectStore.updateById(busiObjCode, object, "paytrabuobject");
    }
    return apiResponse;
  }
}
exports({ entryPoint: MyTrigger });