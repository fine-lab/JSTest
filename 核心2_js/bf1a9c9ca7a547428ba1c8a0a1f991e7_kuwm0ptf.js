let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let params = "12312312312312312312";
    //请求地址
    let url = "https://www.example.com/";
    //固定值secretkey
    var secretkey = "yourkeyHere";
    //获取要编码的数据
    var codData = secretkey + params;
    var md5 = MD5Encode(codData);
    var dataDigest = Base64Encode(md5);
    let body = {
      //固定值
      from_code: "CAKhtDJGLiEljRA",
      to_code: "sto_oms",
      to_appkey: "yourkeyHere",
      from_appkey: "yourkeyHere",
      api_name: "OMS_EXPRESS_ORDER_CREATE",
      data_digest: dataDigest,
      content: params
    };
    let apiResponse = openLinker("POST", url, null, JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });