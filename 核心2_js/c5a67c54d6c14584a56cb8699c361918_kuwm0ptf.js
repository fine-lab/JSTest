let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var timestamp1 = Date.now();
    // 开发人员key
    var appKey1 = "2688";
    var appSecret1 = "tZQFjGVPXMmAGjhY";
    // 版本号
    var version1 = "3";
    // 业务参数
    var requestBody1 = '{"groupID":"346046"}';
    // 品牌id
    var groupID1 = "346046";
    // 请求唯一标识
    var traceID1 = "f4cd347d-4e1f-0e12-89bf-b6b23983362b";
    //校验字段 将 appKey + appSecret + timestamp  +业务参数对应的值，拼接为signature加密前字符串
    var signature1 = MD5Encode(appKey1 + appSecret1 + timestamp1 + requestBody1);
    let body = { appKey: "2688", timestamp: timestamp1, signature: signature1, version: version1, requestBody: '{"groupID":"346046"}' };
    let header = { groupID: groupID1, traceID: traceID1, "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    throw new Error(strResponse);
    let response = JSON.parse(strResponse);
    let list = response.data.shopInfoList;
    var res = ObjectStore.insertBatch("AT19A6F41A1CD80007.AT19A6F41A1CD80007.gc_store_details", list, "storedetailsList");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });