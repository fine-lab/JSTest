let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var tenantIds = context.tenant;
    let param1 = { tenantId: tenantIds };
    let getYmUrl = extrequire("AT17604A341D580008.hd03.getUrl");
    let ymUrl = getYmUrl.execute(param1);
    var gatewayUrl = ymUrl.domainName.gatewayUrl;
    var allData = param.data;
    if (allData.length != 0) {
      var value = allData[0];
    }
    var selzt = param.requestData;
    var newSelzt = JSON.parse(selzt);
    var newStatus = newSelzt._status;
    if (newStatus === "Insert") {
      //数据库编码
      var code = "AT17604A341D580008.AT17604A341D580008.sharingEntity";
      let url = gatewayUrl + "/yonbip/AMP/api/v1/busievent/" + code;
      let apiResponse = openLinker("POST", url, "AT17604A341D580008", JSON.stringify(value));
      var jsonALL = JSON.parse(apiResponse);
      if (jsonALL.code === "200") {
        //凭证id
        var voucherid = jsonALL.eventInfo.srcBusiId;
        var BillVersion = jsonALL.eventInfo.srcBillVersion;
        BillVersion = BillVersion + "";
        var object = { id: voucherid, isVoucher: "1", srcBillVersion: BillVersion };
        var res = ObjectStore.updateById("AT17604A341D580008.AT17604A341D580008.sharingEntity", object, "CostSharings");
        return { jsonALL };
      } else {
        throw new Error("  -- 生成凭证失败 -- ");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });