let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT101792AT1.common.getApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    let func2 = extrequire("GT101792AT1.common.getGatewayUrl");
    let res2 = func2.execute(null);
    var gatewayUrl = res2.gatewayUrl;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let body = {
      pageIndex: 1,
      pageSize: 10,
      batchno: param.batchno,
      productsku: param.productsku
    };
    //调用YS现存量接口获取数据
    let batchNoList = [];
    let getsdUrl = gatewayUrl + "/yonbip/scm/batchno/report/list?access_token=" + token;
    var apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let result = JSON.parse(apiResponse);
    if (result.code == "200") {
      let data = result.data;
      batchNoList = data.recordList;
    }
    return { batchNoList };
  }
}
exports({ entryPoint: MyTrigger });