let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    if (pdata.headItem == null || pdata._status == "Update") {
      // 商家普通销售不进行处理
      if (pdata.transactionTypeId != "1529210246745555402") {
        if (pdata.headItem == null || (pdata.orderDetails[0].bodyItem.define6 == "true" && pdata._status == "Update")) {
          // 请求头
          var hmd_contenttype = "application/json;charset=UTF-8";
          var header = { "Content-Type": hmd_contenttype };
          // 获取token接口地址
          var token_path = "http://218.77.62.91:8082/uapws/rest/nccapi/getToken";
          var body1 = {
            baseUrl: "http://172.16.100.81:9090",
            busiCenter: "01",
            clientSecret: "yourSecretHere",
            clientId: "yourIdHere",
            grantType: "client_credentials",
            pubKey:
              "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2NFHw/5x9SFXwExWgF/ya0T2iD6LDrBnSoARK+JOViEJp2bm2HWRAY44A4tQWTX02jXUQq9oSbkVLB4VEwv4RMjf37r8iytEPtCpAm/DWJSoEu8V54tcfjlpJzF+IqMtcmX1657wN8jzfJYIuWDw6ltgV58INMS6ngrn0NL6HT0/emB3jtHqdW6+BFrYWSWgcmm8gfCxkN3bqytTl7ZSVGMhoiCP0o/5xczvq84bXWkVMxuAxLsVxC+7hcwTUPB+iUBpLTAgJ4ABJ6pooFXrwlqQPMEmELWdzOL8CT1ndbTniL/kc8JoT954/oh/UnFOWsiG2KVBTX7bM7ZKdR3dmwIDAQAB"
          };
          // 调用获取token接口得到token
          var apiResponse = postman("post", token_path, JSON.stringify(header), JSON.stringify(body1));
          var access_token = JSON.parse(apiResponse).data.access_token;
          // 根据客户id查询客户编码
          var sql = "select code from voucher.delivery.Agent where id = '" + pdata.agentId + "'";
          var customerName = ObjectStore.queryByYonQL(sql);
          var details = new Array();
          var postjson = {
            orgname: pdata.salesOrgId_name,
            customercode: customerName[0].code,
            date: pdata.orderDate,
            vbillcode_bip: pdata.code,
            status: pdata._status,
            details: details
          };
          for (let i = 0; i < pdata.orderDetails.length; i++) {
            if (pdata.orderDetails[i].orderProductType == "SALE") {
              var detail = {
                crowno_bip: pdata.orderDetails[i].lineno.toString(),
                materialcode: pdata.orderDetails[i].productCode,
                natmny: pdata.orderDetails[i].orderDetailPrices.natSum,
                originMny: pdata.orderDetails[i].rebateMoney + pdata.orderDetails[i].orderDetailPrices.natSum
              };
              details[i] = detail;
            }
          }
          var base_path = "http://218.77.62.91:8082/uapws/rest/nccapi/exection";
          var body = {
            token: access_token,
            url: "/nccloud/api/credit/creditline/judgment/creditJudgment",
            param: postjson
          };
          var dateResponse = postman("post", base_path, JSON.stringify(header), JSON.stringify(body));
          if (JSON.parse(dateResponse).code != 200) {
            throw new Error(JSON.parse(dateResponse).message);
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });