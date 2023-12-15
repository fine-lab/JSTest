let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      apicode: "b65ba06816bf4d70919f41dc2c78f5fa",
      appkey: "yourkeyHere"
    };
    let responseObj = apiman("get", "http://218.4.202.238:9988/seeyon/rest/token/oa/725df3d9-88c7-4eab-b833-b401a43aa315?loginName=oa", JSON.stringify(header), JSON.stringify(body));
    throw new Error(responseObj);
  }
}
exports({ entryPoint: MyTrigger });