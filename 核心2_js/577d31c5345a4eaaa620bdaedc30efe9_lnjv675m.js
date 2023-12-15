let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { queen, msg } = request;
    let enmsg = encodeURI(msg);
    let header = { cookie: "DMWayRequest=defaultway" };
    let strResponse = postman("get", "https://www.example.com/" + queen + "&msg=" + enmsg, JSON.stringify(header), null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });