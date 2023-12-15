let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let token = JSON.parse(AppContext()).token;
    //信息体
    let body = {};
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      cookie: `yht_access_token=${token}`
    };
    let url = `https://dev-thdangjian.yonisv.com/be/demo/fun1`;
    let responseObj = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyTrigger });