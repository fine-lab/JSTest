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
      id: param.data[0].id,
      code: param.data[0].code
    };
    var strResponse = postman("POST", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
    if (JSON.parse(strResponse).code == "200") {
    } else if (JSON.parse(strResponse).code == "999") {
      throw new Error(JSON.parse(strResponse).message);
    } else {
      throw new Error(JSON.parse(strResponse));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });