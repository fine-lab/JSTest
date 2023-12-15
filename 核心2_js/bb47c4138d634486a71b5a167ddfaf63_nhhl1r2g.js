let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    if (pdata.transactionTypeId != "1529210246745555402") {
      var sql1 = "select * from voucher.order.OrderDetailDefine where orderId = '" + pdata.id + "'";
      var orderDetailDefine = ObjectStore.queryByYonQL(sql1);
      var flag = false;
      for (let item of orderDetailDefine) {
        if (item.define6 == "true") {
          break;
        } else {
          flag = true;
        }
      }
      if (flag) {
        // 根据表头主键查询客户id
        var sql2 = "select agentId,orderDate from voucher.order.Order where id = '" + pdata.id + "'";
        var agentIds = ObjectStore.queryByYonQL(sql2);
        // 根据客户id查询客户编码
        var sql3 = "select code from voucher.delivery.Agent where id = '" + agentIds[0].agentId + "'";
        var customerCodes = ObjectStore.queryByYonQL(sql3);
        var details = new Array();
        var sql = "select * from voucher.order.OrderDetail where orderId = '" + pdata.id + "'";
        var orderDetails = ObjectStore.queryByYonQL(sql);
        for (let i = 0; i < orderDetails.length; i++) {
          if (orderDetails[i].orderProductType == "SALE") {
            var detail = {
              crowno_bip: orderDetails[i].lineno.toString(),
              materialcode: orderDetails[i].productCode,
              natmny: orderDetails[i].oriSum,
              originMny: orderDetails[i].rebateMoney + orderDetails[i].oriSum
            };
            details[i] = detail;
          }
        }
        var postjson = {
          orgname: pdata.settlementOrgId_name,
          customercode: customerCodes[0].code,
          date: agentIds[0].orderDate,
          vbillcode_bip: pdata.code,
          status: "Insert",
          details: details
        };
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
        //获取 access_token Api函数
        let func = extrequire("SCMSA.backDesignerFunction.getOpenApiToken");
        let res = func.execute("");
        var access_token = res.access_token;
        // 销售自定义项更新url
        const updateurl = "https://www.example.com/" + access_token;
        var datas = new Array();
        var definesInfo = new Array();
        for (let i = 0; i < orderDetailDefine.length; i++) {
          definesInfo[i] = {
            define6: "true",
            isHead: false,
            isFree: false,
            detailIds: orderDetailDefine[i].id
          };
        }
        datas[0] = {
          id: pdata.id,
          code: pdata.code,
          definesInfo: definesInfo
        };
        var updatebody = {
          billnum: "voucher_order",
          datas: datas
        };
        //调用销售自定义项更新接口
        let apiResponses = postman("post", updateurl, null, JSON.stringify(updatebody));
        if (JSON.parse(apiResponses).code != 200) {
          throw new Error(JSON.parse(apiResponses).message);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });