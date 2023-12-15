let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tenantid = obj.currentUser.tenantId;
    if (tenantid != "--kegf1e24") {
      return;
    }
    //获取当前租户所在数据中心gatewayUrl
    const dataCenterUrl = "https://www.example.com/" + tenantid;
    let gatewayUrl = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(gatewayUrl);
    let apiPrefix = responseJson.data.gatewayUrl;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      //核心三
      apiRestPre = "https://www.example.com/";
    }
    // 拼装请求报文
    var obj = {
      tenantId: tenantid,
      purchaseOrderId: param.data[0].id,
      purchaseOrderData: param,
      userId: ObjectStore.user().id
    };
    //获取api前缀等信息 参数： 请求方式 ， 地址  ，header ， body http://yongyou.test.api.xhsmfw.cn:18088
    var strResponse = postman("post", "http://yongyou.test.api.xhsmfw.cn:18088" + "/gsp/wms/cgddPushWms", null, JSON.stringify(obj));
    if (strResponse.code != "200") {
      throw new Error(strResponse);
    }
    var rt = JSON.parse(strResponse);
    if (rt.code != "200") {
      if (rt.message.indexOf("记录已存在") == -1) {
        throw new Error(rt.message);
      }
    }
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });