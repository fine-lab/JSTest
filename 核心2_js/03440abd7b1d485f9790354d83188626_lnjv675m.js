let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT28906AT2.student.getToken");
    let res = func1.execute();
    // 可以弹出具体的信息（类似前端函数的alert）
    //信息体
    let body = { techan: request.techan };
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      apicode: "6feb46cd1f8e4d43bec14e1dd32d979b",
      appkey: "yourkeyHere"
    };
    // 可以是http请求
    // 也可以是https请求
    let responseObj = apiman(
      "post",
      "https://www.example.com/" + res.access_token,
      JSON.stringify(header),
      JSON.stringify(body)
    );
    // 可以直观的看到具体的错误信息
    return {
      responseObj
    };
  }
}
exports({ entryPoint: MyAPIHandler });