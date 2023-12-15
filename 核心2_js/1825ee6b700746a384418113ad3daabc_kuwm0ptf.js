let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取前端传来的参数
    let pageIndex = request.pageIndex;
    let pageSize = request.pageSize;
    let orgName = request.orgName;
    let skuName = request.skuName;
    let start = request.start;
    let end = request.end;
    let timestamp = new Date().getTime();
    let token = "yourtokenHere";
    if (orgName == null || orgName == undefined) {
      orgName = "";
    }
    if (skuName == null || skuName == undefined) {
      skuName = "";
    }
    if (start == null || start == undefined) {
      start = "";
    }
    if (end == null || end == undefined) {
      end = "";
    }
    //生成加密的sign
    let str = timestamp + "#" + token + "," + skuName + "&" + start + "@" + orgName + "-" + end;
    let sign = SHA256Encode(timestamp + "#" + token + "," + skuName + "&" + start + "@" + orgName + "-" + end);
    let body = { orgName: orgName, skuName: skuName, start: start, end: end, pageIndex: pageIndex, pageSize: pageSize, timestamp: timestamp };
    let header = { sign: sign };
    //调用三方请求
    let strResponse = postman("post", "http://39.106.84.51/getData", JSON.stringify(header), JSON.stringify(body));
    let arr = JSON.parse(strResponse);
    let returnArr = [];
    for (let i = 0; i < arr.length; i++) {
      let mtSale = arr[i];
      var mtss = {};
      mtss.org_id = mtSale.orgId;
      mtss.org_name = mtSale.poiName;
      mtss.sku_id = mtSale.skuId;
      mtss.sku_name = mtSale.skuName;
      mtss.sale_date = mtSale.saleDate;
      mtss.dish_sale_cnt = mtSale.dishSaleCnt;
      returnArr.push(mtss);
    }
    return { data: returnArr, total: 10, sign: sign, str: str };
  }
}
exports({ entryPoint: MyAPIHandler });