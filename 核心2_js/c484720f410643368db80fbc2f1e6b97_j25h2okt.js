let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.preBillMapInDb;
    var qq = Data["1634735188052803590"];
    var code = qq.code;
    var invoiceOrg = qq.invoiceOrg;
    var ArrayList = new Array();
    var productData = {};
    var ArrList = new Array();
    var SunList = {};
    var details = qq.details;
    if (details != undefined) {
      for (let i = 0; i < details.length; i++) {
        let product = details[i].product;
        var qty = details[i].qty;
        let sql = "select code from pc.product.Product where id = '" + product + "'";
        let pres = ObjectStore.queryByYonQL(sql, "productcenter");
        productData = {
          itemCode: pres[0].code
        };
        ArrayList.push(productData);
        SunList = {
          orderLineNo: i + 1,
          planQty: qty,
          actualQty: qty,
          inventoryType: "01"
        };
        ArrList.push(SunList);
      }
      let func1 = extrequire("ST.api001.getToken");
      let res = func1.execute(require);
      let token = res.access_token;
      let bodys = { key: "yourkeyHere" };
      let headers = { key: "yourkeyHere" };
      let apiResponse = postman(
        "get",
        "https://www.example.com/" + token + "&id=" + URLEncoder(invoiceOrg),
        JSON.stringify(headers),
        JSON.stringify(bodys)
      );
      let apiResponseList = JSON.parse(apiResponse);
      let orgData = apiResponseList.data;
      let orgCode = orgData.code;
      var vouchdate = new Date(qq.vouchdate + 28800000);
      let Year = vouchdate.getFullYear();
      let Moth = vouchdate.getMonth() + 1 < 10 ? "0" + (vouchdate.getMonth() + 1) : vouchdate.getMonth() + 1;
      let Day = vouchdate.getDate() < 10 ? "0" + vouchdate.getDate() : vouchdate.getDate();
      let GMT = Year + "-" + Moth + "-" + Day;
      let jsonBody = {
        outBizOrderCode: code,
        deliveryOrderTime: GMT,
        deliveryOrderCode: code,
        bizOrderType: "OUTBOUND",
        subBizOrderType: "XSCK",
        ownerCode: orgCode,
        warehouseCode: "YADS",
        orderLines: ArrList,
        itemInfo: ArrayList,
        status: "OUTBOUND"
      };
      let body = {
        appCode: "beiwei-oms",
        appApiCode: "standard.sell.order.stockout.confirm",
        schemeCode: "bw47",
        jsonBody: jsonBody
      };
      let header = { key: "yourkeyHere" };
      let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
      let str = JSON.parse(strResponse);
      throw new Error(JSON.stringify(strResponse));
      if (str.success != true) {
        throw new Error(str.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });