let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 可以弹出具体的信息（类似前端函数的alert）
    //信息体
    let body = {};
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      apicode: "51f38239770d4e3da35b7346e8a5a4ff",
      appkey: "yourkeyHere"
    };
    // 可以是http请求
    // 也可以是https请求
    let responseObj = apiman(
      "get",
      "https://www.example.com/",
      JSON.stringify(header),
      JSON.stringify(body)
    );
    let responseObjSet = JSON.parse(responseObj) ? JSON.parse(responseObj) : {};
    // 可以直观的看到具体的错误信息
    return {
      responseObjSet
    };
  }
}
exports({ entryPoint: MyAPIHandler });