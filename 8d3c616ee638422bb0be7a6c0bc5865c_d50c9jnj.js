let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let env = ObjectStore.env();
    let CONFIG = {};
    let API_HW_MSG = {}; // 华为的接口信息
    if (env.tenantId == "d50c9jnj") {
      // 生产-贵州中融信通科技有限公司
      API_HW_MSG.X_HW_ID = "yourIDHere";
      API_HW_MSG.X_HW_APPKEY = "yourKEYHere";
      API_HW_MSG.URL_DOMAIN = "https://www.example.com/";
      API_HW_MSG.URL_RESERVOIROUT = "/queryReservoirOutBoundTask/1.0.0";
      API_HW_MSG.URL_UPDATEOUT = "/saveReservoirOutBoundTask/1.0.0";
      API_HW_MSG.URL_RESERVOIRIN = "/queryReservoirInBoundTask/1.0.0";
      API_HW_MSG.URL_UPDATEIN = "/saveReservoirInBoundTask/1.0.0";
    } else if (env.tenantId == "gx6eogib") {
      // 贵州数算互联科技有限公司
    } else if (env.tenantId == "rz296oih") {
      // 测试-贵州中融信通科技有限公司
      API_HW_MSG.X_HW_ID = "yourIDHere";
      API_HW_MSG.X_HW_APPKEY = "yourKEYHere";
      API_HW_MSG.URL_DOMAIN = "https://www.example.com/";
      API_HW_MSG.URL_RESERVOIROUT = "/queryReservoirOutBoundTask/1.0.0";
      API_HW_MSG.URL_UPDATEOUT = "/saveReservoirOutBoundTask/1.0.0";
      API_HW_MSG.URL_RESERVOIRIN = "/queryReservoirInBoundTask/1.0.0";
      API_HW_MSG.URL_UPDATEIN = "/saveReservoirInBoundTask/1.0.0";
    }
    CONFIG.API_HW_MSG = API_HW_MSG;
    return { CONFIG: CONFIG };
  }
}
exports({ entryPoint: MyTrigger });