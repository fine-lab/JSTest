let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let name = request.name;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    let token = res.access_token;
    //获取内部客户
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let reqwlurl = "https://www.example.com/" + token;
    let body = {
      pageIndex: 1,
      pageSize: 10,
      name: name
    };
    let xqrst = "";
    let custxqResponse = postman("POST", reqwlurl, JSON.stringify(header), JSON.stringify(body));
    let custresxqponseobj = JSON.parse(custxqResponse);
    if ("200" == custresxqponseobj.code) {
      let data = custresxqponseobj.data;
      let recordList = data.recordList;
      if (recordList.length > 0) {
        xqrst = recordList[0];
      }
    }
    return { xqrst };
  }
}
exports({ entryPoint: MyAPIHandler });