let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = [
      {
        bIPRebateReportFormData: {
          CustomerCode: request.data.data2
        }
      }
    ];
    // 信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      // 营销云客开
      token: request.data.data1,
      apicode: "51f38239770d4e3da35b7346e8a5a4ff",
      appkey: "yourkeyHere"
    };
    // 可以是http请求
    // 也可以是https请求
    let responseObj = apiman(
      "post",
      "http://1.14.226.176/U9C/webapi/BIPRebateReportAPI/BIPRebateReportForm",
      JSON.stringify(header),
      JSON.stringify(body)
    );
    // 可以直观的看到具体的错误信息
    let responseObj1 = JSON.parse(responseObj) ? JSON.parse(responseObj) : {};
    return {
      responseObj1
    };
  }
}
exports({ entryPoint: MyAPIHandler });