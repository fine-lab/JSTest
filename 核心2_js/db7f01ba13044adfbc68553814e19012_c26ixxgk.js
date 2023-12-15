let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      id: request.id,
      fpzt: request.fpzt
    };
    let getExchangerate = "https://www.example.com/";
    let rateResponse = openLinker("POST", getExchangerate, "AT1590F01809B00007", JSON.stringify(body));
    let rateresponseobj = JSON.parse(rateResponse);
    return { rateresponseobj };
  }
}
exports({ entryPoint: MyAPIHandler });