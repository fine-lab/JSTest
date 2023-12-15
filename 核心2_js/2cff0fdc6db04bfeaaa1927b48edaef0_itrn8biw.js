let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      pk_saleorder: "111",
      bodys: [
        { materialcode: "02001", nnum: "10", price: "100", mny: "1000" },
        { materialcode: "02002", nnum: "20", price: "200", mny: "4000" }
      ]
    };
    let header = { "Content-Type": "application/json" };
    let strResponse = postman("post", "http://117.27.93.189:9888/uapws/rest/saleorder/resource/checkBond", JSON.stringify(header), JSON.stringify(body));
    throw new Error("ss");
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });