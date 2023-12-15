let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let s = request.response;
    //加密请求头
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    //加密请求参数
    var params = {
      NUMBER: s
    };
    //加密请求体
    let body = {
      data: JSON.stringify(params) + "track_query_adapterv1eiys04dK5W"
    };
    //接口地址
    let url = "http://123.57.144.10:9995/allt/md5AndBase64Enc";
    //使用postman方法调取加密接口（数组转成MD5   base64）
    let md5Response = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    //转成json格式
    var sign1 = JSON.parse(md5Response);
    //获取到加密的后数据
    let sign = sign1.msg;
    //创建时间戳
    let timestamp = new Date().getTime();
    //调取圆通快递的物流查询信息
    let url1 = "https://openapi.yto.net.cn:11443/open/track_query_adapter/v1/PptaYu/open09081406";
    let header1 = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let body1 = {
      timestamp: timestamp,
      param: JSON.stringify(params),
      sign: sign,
      format: "JSON"
    }; //请求参数
    let apiResponses = postman("POST", url1, JSON.stringify(header1), JSON.stringify(body1));
    const jsgs = JSON.parse(apiResponses);
    return { jsgs };
  }
}
exports({ entryPoint: MyAPIHandler });