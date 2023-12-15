let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let values = [];
    request.data.forEach((orderNos) => {
      let body = { bipvbillcode: orderNos };
      let header = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("post", "http://117.27.93.189:38888/uapws/rest/saleorder/resource/QueryFHDKtckData", JSON.stringify(header), JSON.stringify(body));
      let obj = JSON.parse(strResponse);
      if (obj != null && obj.data != undefined) {
        values.push(obj);
      }
    });
    return { values: values };
  }
}
exports({ entryPoint: MyAPIHandler });