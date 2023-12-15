let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT6923AT3.checkOrderBe.getAccessToken");
    let res = func1.execute(null, null);
    let token = res.access_token;
    let orderCode = request.code;
    let orderId = request.id;
    let context = JSON.parse(AppContext());
    let yhtToken = context.token;
    var tenantId = context.currentUser.tenantId;
    let url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/YonSuite/${orderId}/files?includeChild=false&ts=1655781730750&pageSize=10`;
    let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${yhtToken}` };
    let body = {};
    let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    let count = JSON.parse(apiResponse).count;
    let fileStasus = "未上传";
    if (count > 0) {
      fileStasus = "已上传";
    }
    let data = {
      billnum: "voucher_order",
      datas: [
        {
          id: orderId,
          code: orderCode,
          definesInfo: [
            {
              define7: fileStasus,
              isHead: true,
              isFree: false
            }
          ]
        }
      ]
    };
    if (tenantId === "kvujazhp") {
      data = {
        billnum: "voucher_order",
        datas: [
          {
            id: orderId,
            code: orderCode,
            definesInfo: [
              {
                define8: fileStasus,
                isHead: true,
                isFree: false
              }
            ]
          }
        ]
      };
    }
    var saveOrder = postman("post", "https://www.example.com/" + token, "", JSON.stringify(data));
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });