let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let MODE = "dev";
    var currentUser = JSON.parse(AppContext()).currentUser;
    let envUrl = ObjectStore.env().url;
    let BASE_DATA = {
      dev: {
        receiveMesUrl: "https://www.example.com/",
        receiveSNMesUrl: "https://www.example.com/",
        arrivalZjTozyyUrl: "https://www.example.com/",
        zjAppKey: "yourKeyHere",
        zjAppId: "yourIdHere",
        arrivalDetailUrl: envUrl + "/iuap-api-gateway/yonbip/scm/arrivalorder/detail",
        arrivalSaveUrl: envUrl + "/iuap-api-gateway/yonbip/scm/arrivalorder/singleSave_v1",
        tokenUrl: "https://www.example.com/",
        userCode: "ZRXTADMIN",
        key: "yourkeyHere",
        sign: "6e7489f1688baded2a380e767ce43d98",
        gatewayUrl: envUrl + "/iuap-api-gateway",
        logUrl: "/" + currentUser.tenantId + "/product_ref/product_ref_01/insertLog",
        arrivalToHWUrl: "https://www.example.com/",
        deliveryToZyyUrl: "https://www.example.com/",
        XHWID: "yourIDHere",
        XHWAPPKEY: "yourKEYHere",
        SUPPLIER_CODE: "Z03B4B",
        FACTORY_CODE: "Z03B4B-002"
      },
      prod: {
        receiveMesUrl: "https://www.example.com/",
        receiveSNMesUrl: "https://www.example.com/",
        arrivalZjTozyyUrl: "https://www.example.com/",
        zjAppKey: "yourKeyHere",
        zjAppId: "yourIdHere",
        arrivalDetailUrl: envUrl + "/iuap-api-gateway/yonbip/scm/arrivalorder/detail",
        arrivalSaveUrl: envUrl + "/iuap-api-gateway/yonbip/scm/arrivalorder/singleSave_v1",
        tokenUrl: "https://www.example.com/",
        userCode: "ZRXTADMIN",
        key: "yourkeyHere",
        sign: "07d2e1e360752985789b0733b57e55f8",
        gatewayUrl: envUrl + "/iuap-api-gateway",
        logUrl: "/" + currentUser.tenantId + "/product_ref/product_ref_01/insertLog",
        arrivalToHWUrl: "https://www.example.com/",
        deliveryToZyyUrl: "https://www.example.com/",
        XHWID: "yourIDHere",
        XHWAPPKEY: "yourKEYHere",
        SUPPLIER_CODE: "Z03B4B",
        FACTORY_CODE: "Z03B4B-002"
      }
    };
    return { BASE: BASE_DATA[MODE] };
  }
}
exports({ entryPoint: MyTrigger });