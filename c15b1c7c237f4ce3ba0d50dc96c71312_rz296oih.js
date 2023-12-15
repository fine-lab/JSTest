let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const MODE = "dev";
    var currentUser = JSON.parse(AppContext()).currentUser;
    let env = ObjectStore.env();
    let X_HW_ID = ""; // S的授权信息
    let X_HW_APPKEY = ""; // S的授权信息
    if (env.tenantId == "d50c9jnj") {
      // 生产-贵州中融信通科技有限公司
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
    } else if (env.tenantId == "gx6eogib") {
      // 贵州数算互联科技有限公司
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
    } else if (env.tenantId == "rz296oih") {
      // 测试-贵州中融信通科技有限公司
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
    }
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
        XHWID: X_HW_ID,
        XHWAPPKEY: X_HW_APPKEY,
        queryInventoryUrl: "https://www.example.com/"
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
        XHWID: X_HW_ID,
        XHWAPPKEY: X_HW_APPKEY
      }
    };
    return { BASE: BASE_DATA[MODE] };
  }
}
exports({ entryPoint: MyTrigger });