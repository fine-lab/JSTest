let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let orderid = request.orderid;
    let code = request.code;
    let resubmitCheckKey = JSON.stringify(new Date().getTime());
    let uptObj = {
      billnum: "voucher_order",
      datas: [
        {
          id: orderid,
          code: code,
          definesInfo: [
            {
              define21: null,
              define22: null,
              isHead: true,
              isFree: false
            }
          ]
        }
      ]
    };
    let url = "https://www.example.com/" + access_token;
    let apiResponse = postman("POST", url, null, JSON.stringify(uptObj));
    // 标准产品部分单据的数据无法通过实体操作直接修改，考虑远程调用api修改发货单数据
    return { request: url, response: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });