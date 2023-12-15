let AbstractTrigger = require("AbstractTrigger");
class DinghuoControlTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    // 商家普通销售不进行处理
    if (pdata.transactionTypeId != "1529210246745555402") {
      if (pdata.headItem == null || pdata.headItem.define4 == "false") {
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
        // 获取到货日期接口地址
        var base_path = "http://218.77.62.91:8082/uapws/rest/nccapi/exection";
        // 获取单据日期 vouchdate = 2022-11-08 00:00:00
        var vouchdate = formatMsToDate(pdata.vouchdate + 8 * 3600 * 1000);
        // 根据客户id查询客户名称 customerName = [{"name":"天府新区成都片区华阳富铖酒水经营部"}]
        var sql = "select name from voucher.delivery.Agent where id = '" + pdata.agentId + "'";
        var customerName = ObjectStore.queryByYonQL(sql);
        // 收货地址
        if (pdata.receiveAddress) {
          var index = pdata.receiveAddress.lastIndexOf(" ");
          var address = pdata.receiveAddress.substr(index + 1, pdata.receiveAddress.length);
        }
        var weightSum = 0;
        for (let item of pdata.orderDetails) {
          var body = {
            token: access_token,
            url: "/nccloud/api/uapbd/psndocmanage/psndoc/queryDefdocDate",
            param: {
              consignTime: vouchdate, //pdata.vouchdate
              zhandian: address,
              num: item.subQty,
              code: item.productCode, //pdata.orderDetails[0].productCode
              customerName: customerName[0].name //"天府新区成都片区华阳富铖酒水经营部"
            }
          };
          // 获取期望到货日期和根据物料判断重量是否超过8吨来控制下单
          var dateResponse = postman("post", base_path, JSON.stringify(header), JSON.stringify(body));
          var obj = JSON.parse(dateResponse);
          if (!obj.success) {
            throw new Error(JSON.parse(obj.message).message);
          }
          var hopeReceiveDate = JSON.parse(obj.message).date; // 2022-11-27 00:00:00
          var weightsum = JSON.parse(obj.message).weightsum; // 每行物料返回的重量
          if (item.orderProductType == "SALE") {
            weightSum += weightsum == null ? 0 : weightsum;
          }
          var siteid = JSON.parse(obj.message).siteid; // 站点id
          var sitename = JSON.parse(obj.message).sitename; // 站点名称
          item.consignTime = new Date(vouchdate).getTime();
          if (item.bodyItem) {
            item.bodyItem.set("define7", hopeReceiveDate); // 期望到货日期
            item.bodyItem.set("define3", weightsum == null ? "" : (weightsum / 1000).toString()); // 每行重量
            item.bodyItem.set("define4", siteid == null ? "" : siteid); // 站点id
            item.bodyItem.set("define5", sitename == null ? "" : sitename); // 站点名称
            if (pdata.headItem == null) {
              item.bodyItem.set("define6", "true");
            }
          }
        }
        if (weightSum > 0 && weightSum < 8000) {
          throw new Error("定购的商品中有椰汁系列产品，总重量小于8吨，不允许下单！总重量为：" + weightSum / 1000 + "吨！");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: DinghuoControlTrigger });
addZero = function (num) {
  if (parseInt(num) < 10) {
    num = "0" + num;
  }
  return num;
};
//把毫秒数转化成具体日期   2021-06-04 00:00:00
//参数 毫秒数
function formatMsToDate(ms) {
  if (ms) {
    var oDate = new Date(ms),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + "-" + addZero(oMonth) + "-" + addZero(oDay) + " " + addZero(oHour) + ":" + addZero(oMin) + ":" + addZero(oSen);
    return oTime;
  } else {
    return "";
  }
}