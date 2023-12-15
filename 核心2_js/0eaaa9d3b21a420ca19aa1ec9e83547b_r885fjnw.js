let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 可以弹出具体的信息（类似前端函数的alert）
    //信息体
    let body = {};
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    // 可以直观的看到具体的错误信息
    let responseObj = postman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return {
      responseObj
    };
  }
}
exports({
  entryPoint: MyTrigger
});