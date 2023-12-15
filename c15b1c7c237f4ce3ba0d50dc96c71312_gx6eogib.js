let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const MODE = "prod";
    var currentUser = JSON.parse(AppContext()).currentUser;
    const BASE_DATA = {
      dev: {
        receiveMesUrl: "https://www.example.com/",
        receiveSNMesUrl: "https://www.example.com/",
        arrivalZjTozyyUrl: "https://www.example.com/",
        zjAppKey: "yourKeyHere",
        zjAppId: "yourIdHere",
        arrivalDetailUrl: "https://www.example.com/",
        arrivalSaveUrl: "https://www.example.com/",
        tokenUrl: "https://www.example.com/",
        userCode: "ZRXTADMIN",
        key: "yourkeyHere",
        sign: "6e7489f1688baded2a380e767ce43d98",
        gatewayUrl: "https://www.example.com/",
        logUrl: "/" + currentUser.tenantId + "/product_ref/product_ref_01/insertLog",
        arrivalToHWUrl: "https://www.example.com/",
        deliveryToZyyUrl: "https://www.example.com/",
        XHWID: "yourIDHere",
        XHWAPPKEY: "yourKEYHere"
      },
      prod: {
        receiveMesUrl: "https://www.example.com/",
        receiveSNMesUrl: "https://www.example.com/",
        arrivalZjTozyyUrl: "https://www.example.com/",
        zjAppKey: "yourKeyHere",
        zjAppId: "yourIdHere",
        arrivalDetailUrl: "https://www.example.com/",
        arrivalSaveUrl: "https://www.example.com/",
        tokenUrl: "https://www.example.com/",
        userCode: "ZRXTADMIN",
        key: "yourkeyHere",
        sign: "07d2e1e360752985789b0733b57e55f8",
        gatewayUrl: "https://www.example.com/",
        logUrl: "/" + currentUser.tenantId + "/product_ref/product_ref_01/insertLog",
        arrivalToHWUrl: "https://www.example.com/",
        deliveryToZyyUrl: "https://www.example.com/",
        XHWID: "yourIDHere",
        XHWAPPKEY: "yourKEYHere"
      }
    };
    return { BASE: BASE_DATA[MODE] };
  }
}
exports({ entryPoint: MyTrigger });