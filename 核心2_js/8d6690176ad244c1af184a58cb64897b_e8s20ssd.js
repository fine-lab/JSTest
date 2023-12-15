let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var base_path = "http://117.145.186.110:9080/servlet/customerDelServlet";
    let header = { "Content-type": "application/json" };
    var body = {
      id: data.id
    };
    // 调用api函数
    let apiResponse = postman("post", base_path, JSON.stringify(header), JSON.stringify(body));
    var result = JSON.stringify(apiResponse);
    var flag = includes(result, "true");
    if (!flag) {
      throw new Error("NC客户同步删除失败：错误信息为：" + result);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });