let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const code = request.udhNo;
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var obj = [];
    var main = ObjectStore.selectByMap("GT80750AT4.GT80750AT4.address_split_info", { udhNo: code, deletRow: 0 });
    main.forEach((r) => {
      var sub = ObjectStore.selectByMap("GT80750AT4.GT80750AT4.splited_info", { address_split_info_id: r.id });
      obj.push({
        WmsId: r.wmsId,
        NewAddress: r.address,
        NewUserName: r.userName,
        NewPhone: r.phone,
        List: sub.map((s) => ({
          NewAddress: s.newAddress,
          NewPhone: s.newPhone,
          NewUserName: s.newUserName,
          NewAmount: s.newAmount
        }))
      });
    });
    pushSplitAddressToWms(obj);
    return {
      code: 200,
      data: obj
    };
    //多地址拆分wms推送
    function pushSplitAddressToWms(params) {
      let appKey = config.busAppKey;
      let appSecret = config.busAppSecret;
      // 请求路径
      let path = "P13_013";
      // 来源
      let source = "P13";
      // 数据 Category 操作类型 1=挂起,2=取消
      let siteData = params;
      // 随机字符串 100000 899999
      let nonce = Math.round(Math.random() * 899999 + 100000).toString();
      // 时间戳
      let timestamp = Date.parse(new Date()).toString();
      // 数据
      siteData = JSON.stringify(siteData);
      let httpDataJson = JSON.stringify({
        appKey: appKey,
        data: siteData,
        nonce: nonce,
        path: path,
        source: source,
        timestamp: timestamp
      });
      let signStr = appSecret + httpDataJson + appSecret;
      let sign = MD5Encode(signStr);
      // 封装请求参数
      let reqBody = {
        path: path,
        data: siteData,
        appKey: appKey,
        source: source,
        nonce: nonce,
        timestamp: timestamp,
        sign: sign
      };
      // 响应信息
      let result = postman("post", config.busUrl, "", JSON.stringify(reqBody));
      try {
        // 处理总线返回信息
        result = JSON.parse(result);
        if (result.code != 200) {
          updateRemark(result.msg);
          updateWmsStatus("3");
          throw new Error("wms返回信息code不为200" + JSON.stringify(result));
        }
        if (!result.data.outRst) {
          updateRemark("wms返回信息outRst为false" + JSON.stringify(result));
          updateWmsStatus("3");
          throw new Error(result.data.outMsg);
        }
      } catch (e) {
        throw new Error(e);
      }
    }
    function updateRemark(words) {
      let body = { remark: words };
      let url = "https://www.example.com/";
      return openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: code, data: body }));
    }
    function updateWmsStatus(status) {
      let body = { wmsStatus: status };
      let url = "https://www.example.com/";
      return openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: code, data: body }));
    }
  }
}
exports({ entryPoint: MyAPIHandler });