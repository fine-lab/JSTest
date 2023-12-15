let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var email = request.email;
    var mobile = request.mobile;
    let apiResponse = null;
    let psn = {};
    if (mobile) {
      let body = {
        pageIndex: 1,
        pageSize: 10,
        mobile: mobile
      };
      let url = "https://www.example.com/";
      apiResponse = openLinker("POST", url, "GZTBDM", JSON.stringify(body));
    }
    if (!apiResponse && email) {
      let body = {
        pageIndex: 1,
        pageSize: 10,
        email: email
      };
      let url = "https://www.example.com/";
      apiResponse = openLinker("POST", url, "GZTBDM", JSON.stringify(body));
    }
    if (apiResponse) {
      let psnObj = JSON.parse(apiResponse);
      if (psnObj && psnObj.data && psnObj.data.recordList && psnObj.data.recordList.length > 0) {
        psn = psnObj.data.recordList[0];
      }
    }
    return psn;
  }
}
exports({ entryPoint: MyAPIHandler });