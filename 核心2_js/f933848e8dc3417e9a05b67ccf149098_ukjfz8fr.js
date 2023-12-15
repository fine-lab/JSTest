let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(param) {
    let func1 = extrequire("ST.myUtil.usechayidanapi");
    let requset = {
      url: "https://www.example.com/",
      param: param
    };
    let res = func1.execute(requset);
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });