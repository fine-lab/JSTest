let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var date = Date.now();
    let url = "http://123.57.144.10:9995/allt/md5";
    //头部信息
    let header = {
      //提交格式
      "Content-Type": "application/json;charset=UTF-8"
    };
    var warehouseId = request.warehouseId;
    //查询仓库档案
    var queryWarehouseSql = "select code from aa.warehouse.Warehouse  where id='" + warehouseId + "'";
    var warehouseRes = ObjectStore.queryByYonQL(queryWarehouseSql, "productcenter");
    var idnum = request.idnum;
    var queryProductSql = " select mnemonicCode from pc.product.ProductDetail where productId='" + idnum + "'";
    var productRes = ObjectStore.queryByYonQL(queryProductSql, "productcenter");
    if (warehouseRes.length == 0) {
      throw new Error("未找到对应的仓库档案信息！");
    }
    let data = {
      params: {
        appKey: "yourKeyHere",
        method: "greatonce.oms.stock.list",
        customerId: "yourIdHere",
        timestamp: "" + date + ""
      },
      body: {
        skuCodes: productRes[0].mnemonicCode,
        warehouseCode: warehouseRes[0].code
      },
      secrect: "bb31941ed1dc205371281af38e04082e"
    };
    //调用请求地址
    let urls = "http://123.57.144.10:9995/allt/getJuYiData";
    //调用巨益接口发送
    let sendRes = postman("POST", urls, JSON.stringify(header), JSON.stringify(data));
    let sendJSON = JSON.parse(sendRes);
    if ("200" == sendJSON.code) {
      let jyJson = JSON.parse(sendJSON.msg);
      if (jyJson.code != "0") {
        throw new Error(jyJson.message);
      }
    } else {
      throw new Error(sendJSON.msg);
    }
    let res = JSON.parse(sendJSON.msg);
    var quantity = 0;
    var available = 0;
    var result = res.stockInfoList[0];
    if (result != null) {
      quantity = result.quantity;
      available = result.availableQuantity;
    }
    return { quantity, available };
  }
}
exports({ entryPoint: MyAPIHandler });