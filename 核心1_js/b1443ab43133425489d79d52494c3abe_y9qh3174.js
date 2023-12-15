let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      let tokenData = postman(
        "get",
        "https://www.baidu.com"
      );
      //解析数据      把字符串编程JSON对象
      let tokenDataJson = JSON.parse(tokenData);
      let Authorization = tokenDataJson.data;
      let header = {
        Authorization
      };
      let body = {};
      let sbmxData = postman(
        "get",
        'https://iot.yonyoucloud.com/thing/api/v1/product/simple?pageInfo={"pageNum":0,"pageSize":1000}',
        JSON.stringify(header),
        JSON.stringify(body)
      );
      let items = JSON.parse(sbmxData).data.items;
      //解析时间格式
      return { items };
    } catch (error) {
      return { error };
    }
  }
}
exports({ entryPoint: MyTrigger });