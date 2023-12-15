let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var date = Date.now();
    //头部信息
    let header = {
      //提交格式
      "Content-Type": "application/json;charset=UTF-8"
    };
    var warehouseId = request.warehouseId;
    //查询仓库档案
    var queryWarehouseSql = "select code from aa.warehouse.Warehouse  where id='" + warehouseId + "'";
    var warehouseRes = ObjectStore.queryByYonQL(queryWarehouseSql, "productcenter");
    if (warehouseRes.length == 0) {
      throw new Error("未找到对应的仓库档案信息！");
    }
    var productMap = new Map();
    var productList = request.productList;
    var skuCodeLists = new Array();
    for (var i = 0; i < productList.length; i++) {
      var idnum = productList[i];
      var queryProductSql = " select id,mnemonicCode from pc.product.ProductDetail where productId='" + idnum + "'";
      var productRes = ObjectStore.queryByYonQL(queryProductSql, "productcenter");
      if (productRes.length == 0) {
        throw new Error("未找到对应物料档案，请检查！");
      }
      if (productRes[0].mnemonicCode == null) {
        throw new Error("物料档案对应“助记码”为空，请检查！");
      }
      productMap.set(productRes[0].mnemonicCode, idnum);
      skuCodeLists.push(productRes[0].mnemonicCode);
    }
    let data = {
      params: {
        appKey: "yourKeyHere",
        method: "greatonce.oms.stock.list",
        customerId: "yourIdHere",
        timestamp: "" + date + ""
      },
      body: {
        skuCodeLists: skuCodeLists,
        warehouseCode: warehouseRes[0].code
      },
      secrect: "e0f1ee9231834c8094cf4d5588c4ff37"
    };
    //调用请求地址
    let urls = "http://139.196.156.252:8081/allt/sendJuYiData";
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
    var result = res.stockInfoList;
    var returnList = new Array();
    var ttMap = new Map();
    //循环合并巨益返回的参数，相同物料的库存进行合并
    for (var j = 0; j < result.length; j++) {
      var resultData = result[j];
      var skuCode = resultData.skuCode;
      if (ttMap.get(skuCode) != null) {
        var oldData = ttMap.get(skuCode);
        resultData.quantity = oldData.quantity + resultData.quantity;
        resultData.availableQuantity = oldData.availableQuantity + resultData.availableQuantity;
        ttMap.set(skuCode, resultData);
      } else {
        ttMap.set(skuCode, resultData);
      }
    }
    //将合并后，巨益物料code转换成用友物料id
    for (let key of ttMap.keys()) {
      var resultData = ttMap.get(key);
      var productId = productMap.get(key);
      resultData.skuCode = productId;
      returnList.push(resultData);
    }
    return { returnList };
  }
}
exports({ entryPoint: MyAPIHandler });