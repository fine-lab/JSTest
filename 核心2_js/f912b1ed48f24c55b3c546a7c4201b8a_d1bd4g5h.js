let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let beginDate = request.beginDate;
    let endDate = request.endDate;
    let docNo = request.docNo;
    let docType = request.docType;
    let pageIndex = request.pageIndex;
    let pageSize = request.pageSize;
    let docId = request.docId;
    if (typeof docId === "undefined" || docId === null) {
      throw new Error("请登录客户管理员账号或业务员账号！");
    }
    var sql = "select id , code , name from aa.merchant.Merchant where id = '" + docId + "'";
    var resData = ObjectStore.queryByYonQL(sql, "productcenter");
    let code = resData[0].code;
    let name = resData[0].name;
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      apicode: "90c04e2f30b84df18ff0ed29ece9a573",
      appkey: "yourkeyHere"
    };
    if (typeof docNo === "undefined" || docNo === null) {
      docNo = "";
    } else {
      pageIndex = 1;
    }
    let body = {
      context: {
        CultureName: "zh-CN",
        EntCode: "1",
        OrgCode: "108401",
        UserCode: "BIP"
      },
      opType: "CustomAccountDetail",
      jsonData:
        '{"CustomerCode":"' + code + '","BeginDate":"' + beginDate + '","EndDate":"' + endDate + '","DocType":"","DocNo":"' + docNo + '","PageIndex":' + pageIndex + ',"PageSize":' + pageSize + "}"
    };
    let apiResponse = apiman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });