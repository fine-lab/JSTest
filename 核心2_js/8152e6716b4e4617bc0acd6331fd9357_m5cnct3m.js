let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //后端脚手架的token获取
    let res = AppContext();
    res = JSON.parse(res);
    var headers = {
      yht_access_token: res.token
    };
    let body = {
      data: param.data[0]
    };
    var strResponse = postman("POST", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
    if (JSON.parse(strResponse).code == "999") {
      throw new Error(JSON.parse(strResponse).message);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });