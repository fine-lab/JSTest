let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let supname = request.supname;
    let supcode = request.supcode;
    let pkorg = request.pkorg;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      pageIndex: "1",
      pageSize: "1000",
      vendororg: [pkorg],
      code: supcode,
      stopstatus: false,
      retailInvestors: false
    };
    let supplier = -1;
    var supplierResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let supplierResJson = JSON.parse(supplierResp);
    if ("200" === supplierResJson.code && supplierResJson.data.recordCount === 1) {
      supplier = supplierResJson.data.recordList[0];
    } else if ("200" === supplierResJson.code && supplierResJson.data.recordCount > 1) {
      let recordList = supplierResJson.data.recordList;
      for (let sup of recordList) {
        if (supname === sup.name) {
          supplier = sup;
        }
      }
    }
    return { supplier };
  }
}
exports({ entryPoint: MyAPIHandler });