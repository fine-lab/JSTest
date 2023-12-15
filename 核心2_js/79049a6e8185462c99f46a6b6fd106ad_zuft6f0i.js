let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    let flg = request.flg;
    let YSCode = request.YSCode;
    let YSU8code = request.YSU8code;
    let url = "";
    try {
      switch (flg) {
        case 1:
          url = "http://47.114.7.189:3690/LS/Check/CheckPo";
          break;
        case 2:
          url = "http://47.114.7.189:3690/LS/Check/CheckRd";
          break;
      }
      let apiResponse = postman("post", url, JSON.stringify({}), JSON.stringify([{ YSCode, YSU8code }]));
      console.log("响应参数= " + apiResponse);
    } catch (ex) {
      console.log("错误信息" + ex.toString());
      rsp.code = 500;
      rsp.msg = ex.toString();
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });