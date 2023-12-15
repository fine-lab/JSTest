let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    //时间转换
    function formatDate(date) {
      var dates = new Date(date);
      var YY = dates.getFullYear() + "-";
      var MM = (dates.getMonth() + 1 < 10 ? "0" + (dates.getMonth() + 1) : datesgetMonth() + 1) + "-";
      var DD = dates.getDate() < 10 ? "0" + dates.getDate() : dates.getDate();
      var hh = (dates.getHours() < 10 ? "0" + dates.getHours() : dates.getHours()) + ":";
      var mm = (dates.getMinutes() < 10 ? "0" + dates.getMinutes() : dates.getMinutes()) + ":";
      var ss = dates.getSeconds() < 10 ? "0" + dates.getSeconds() : dates.getSeconds();
      return YY + MM + DD + " " + hh + mm + ss;
    }
    //获取子表
    let sql1 = "select * from pu.arrivalorder.ArrivalOrders where mainid=" + pdata.id;
    var ps = ObjectStore.queryByYonQL(sql1);
    var oth = {};
    var purInRecords = [];
    var warehouse = "";
    for (var item of ps) {
      //根据物料id拿到物料ID,库存单位
      let sql3 = "select id,stockUnit from pc.product.ProductExtend where id=" + item.product;
      var res4 = ObjectStore.queryByYonQL(sql3, "productcenter");
      warehouse = item.warehouse;
      oth = {
        product: item.product,
        productsku: item.productsku,
        qty: item.qty,
        stockUnitId: res4[0].stockUnit,
        priceUOM: item.priceUOM,
        oriMoney: item.oriMoney,
        oriSum: item.oriSum,
        oriTax: item.oriTax,
        taxRate: item.taxRate,
        oriUnitPrice: item.oriUnitPrice,
        oriTaxUnitPrice: item.oriTaxUnitPrice,
        natUnitPrice: item.oriUnitPrice,
        natTaxUnitPrice: item.oriTaxUnitPrice,
        natMoney: item.oriMoney,
        natSum: item.oriSum,
        natTax: item.oriTax,
        autoCalcCost: "false",
        costMoney: item.oriMoney,
        costUnitPrice: item.oriUnitPrice,
        _status: "Insert"
      };
      purInRecords.push(oth);
    }
    var pdatas = {
      data: {
        org: pdata.org,
        purchaseOrg: pdata.purchaseOrg,
        accountOrg: 2275783073288960,
        inInvoiceOrg: pdata.inInvoiceOrg,
        vouchdate: formatDate(pdata.vouchdate),
        bustype: 2329235890196736, //pdata.busType,
        warehouse: 2315354006607360, //warehouse,
        vendor: pdata.vendor,
        currency: pdata.currency,
        natCurrency: pdata.currency,
        exchRateType: pdata.exchRateType,
        exchRate: pdata.exchRate,
        _status: "Insert",
        purInRecords: purInRecords
      }
    };
    var resdata = JSON.stringify(pdatas);
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      resdata: resdata
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res_r = func.execute("");
    var token2 = res_r.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(pdatas));
    var strrr = JSON.stringify(body);
    //加判断
    var obj = JSON.parse(apiResponse);
    var resp = obj.data;
    var code = obj.code;
    if (code != "200") {
      throw new Error("失败!" + obj.message);
    }
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });