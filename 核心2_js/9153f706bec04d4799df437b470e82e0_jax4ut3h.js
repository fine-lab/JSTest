let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用简道云流水号+当前时间通过MD5加密生成幂等Key
    let md5Data = request.code + new Date();
    let resMD5 = MD5Encode(md5Data);
    return { resMD5 };
  }
}
exports({ entryPoint: MyAPIHandler });