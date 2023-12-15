let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { id: "youridHere", fukuanjine: "1002" };
    var res = ObjectStore.updateById("GT2343AT19.GT2343AT19.shoukuanjiesuandan2", object, "a470d83aList");
    let url = "http://172.20.53.36:8081/nccloud/api/imag/demimag/imagconfig/getnccserverinfo";
    let header = { "content-type": "application/json;charset=utf-8" };
    //查询内容
    var object = {};
    //实体查询
    var res = ObjectStore.selectById("GT2343AT19.GT2343AT19.shoukuanjiesuandan2", object);
    let body = {};
    let nccEnv = {
      clientId: "ssc",
      clientSecret: "yourSecretHere",
      pubKey: "yourKeyHere",
      username: "1",
      userCode: "",
      password: "yourpasswordHere",
      grantType: "password",
      secretLevel: "L0",
      busiCenter: "ncc2021.11",
      busiId: "",
      repeatCheck: "",
      tokenUrl: "http://172.20.53.36:8081/nccloud/opm/accesstoken"
    };
    return { request: request };
  }
}
exports({ entryPoint: MyAPIHandler });