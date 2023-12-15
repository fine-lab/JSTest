let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var materCode = request.code; //商品code
    var skuCode = request.skucode; //sku编码
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var body = {
      pageSize: 100,
      pageIndex: 1,
      code: materCode
    };
    var reqkhdetailurl = "https://www.example.com/" + token;
    let returnData = {};
    var khcustResponse = postman("POST", reqkhdetailurl, JSON.stringify(header), JSON.stringify(body));
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      var resdata = kehucustresponseobj.data.recordList;
      if (resdata.length > 0) {
        //主计量单位id
        returnData.unit = resdata[0].unit;
        returnData.unitName = resdata[0].unit_Name;
        //物料id
        returnData.materid = resdata[0].id;
        returnData.matername = resdata[0].name;
        //查询物料对应的SKU信息
        let querySKUSql = "select * from  pc.product.ProductSKU where productId=" + resdata[0].id;
        let skuRes = ObjectStore.queryByYonQL(querySKUSql, "productcenter");
        if (skuRes.length == 0) {
          return { returnData };
        } else {
          for (var i = 0; i < skuRes.length; i++) {
            let skudata = skuRes[i];
            if (skudata.code == skuCode) {
              returnData.skuid = skudata.id;
              returnData.free1 = skudata.free1;
              returnData.free2 = skudata.free2;
              returnData.free3 = skudata.free3;
              returnData.free4 = skudata.free4;
              returnData.free5 = skudata.free5;
              break;
            }
          }
        }
      }
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });