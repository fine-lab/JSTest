let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var appKey = "yourKeyHere";
    var appSecret = "yourSecretHere";
    var billdate = request.billdate;
    var ware_id = request.ware_id;
    var access_token = request.access_token;
    var ware_name = request.ware_name;
    //请求方式
    let mode = "POST";
    let nowDate = new Date();
    let nowDateStr = formatDateTime(nowDate);
    let suffix = "?" + "access_token=" + access_token;
    let queryCurrentStockUrl = "https://www.example.com/" + suffix;
    let queryCurrentStockParam = { warehouse: ware_id };
    let queryCurrentStockData = CallAPI(mode, queryCurrentStockUrl, queryCurrentStockParam);
    let currentStockData = JSON.parse(queryCurrentStockData);
    var queryMaterialOutListUrl = "https://www.example.com/" + suffix;
    let queryMaterialOutParam = {
      pageIndex: 1,
      pageSize: 100000,
      simpleVOs: [{ field: "vouchdate", op: "between", value1: billdate, value2: nowDateStr }],
      stockOrg: [ware_id],
      locale: "zh_CN"
    };
    let queryMaterialOutListData = CallAPI(mode, queryMaterialOutListUrl, queryMaterialOutParam);
    let MaterialOutListData = JSON.parse(queryMaterialOutListData);
    let queryStoreOutListUrl = "https://www.example.com/" + suffix;
    let queryStoreOutParam = {
      pageIndex: 1,
      pageSize: 100000,
      vouchdate: billdate + "|" + nowDateStr,
      outwarehouse_name: ware_id
    };
    let queryStoreOutData = CallAPI(mode, queryStoreOutListUrl, queryStoreOutParam);
    let storeOutData = JSON.parse(queryStoreOutData);
    let queryOtherOutListUrl = "https://www.example.com/" + suffix;
    let queryOtherOutParam = {
      pageIndex: 1,
      pageSize: 100000,
      simpleVOs: [{ field: "vouchdate", op: "between", value1: billdate, value2: nowDateStr }],
      warehouse_name: ware_name,
      locale: "zh_CN"
    };
    let queryOtherOutData = CallAPI(mode, queryOtherOutListUrl, queryOtherOutParam);
    let otherOutData = JSON.parse(queryOtherOutData);
    let querySaleOutListUrl = "https://www.example.com/" + suffix;
    let querySaleOutParam = {
      pageIndex: 1,
      pageSize: 100000,
      vouchdate: billdate + "|" + nowDateStr,
      warehouse: { id: ware_id }
    };
    let querySaleOutData = CallAPI(mode, querySaleOutListUrl, querySaleOutParam);
    let saleOutData = JSON.parse(querySaleOutData);
    let queryOtherInListUrl = "https://www.example.com/" + suffix;
    let queryOtherInParam = {
      pageIndex: 1,
      pageSize: 100000,
      simpleVOs: [{ field: "vouchdate", op: "between", value1: billdate, value2: nowDateStr }],
      warehouse_name: ware_name
    };
    let queryOtherInData = CallAPI(mode, queryOtherInListUrl, queryOtherInParam);
    let otherInData = JSON.parse(queryOtherInData);
    let queryPurchaseInListUrl = "https://www.example.com/" + suffix;
    let queryPurchaseInParam = {
      pageIndex: 1,
      pageSize: 100000,
      simpleVOs: [{ field: "vouchdate", op: "between", value1: billdate, value2: nowDateStr }],
      warehouse_name: ware_name
    };
    let queryPurchaseInData = CallAPI(mode, queryPurchaseInListUrl, queryPurchaseInParam);
    let purchaseInData = JSON.parse(queryPurchaseInData);
    let queryStoreInListUrl = "https://www.example.com/" + suffix;
    let queryStoreInParam = {
      access_token: access_token,
      pageIndex: 1,
      pageSize: 100000,
      vouchdate: billdate + "|" + nowDateStr,
      inwarehouse_name: ware_id
    };
    let queryStoreInData = CallAPI(mode, queryStoreInListUrl, queryStoreInParam);
    let storeInData = JSON.parse(queryStoreInData);
    let queryProdInListUrl = "https://www.example.com/" + suffix;
    let queryProdInParam = {
      pageIndex: 1,
      pageSize: 100000,
      simpleVOs: [{ field: "vouchdate", op: "between", value1: billdate, value2: nowDateStr }],
      warehouse_name: ware_name
    };
    let queryProdInData = CallAPI(mode, queryProdInListUrl, queryProdInParam);
    let prodInData = JSON.parse(queryProdInData);
    let invid = "",
      invid_temp = "";
    let currentQty = 0,
      availableqty = 0,
      qty_temp = 0;
    let invList = [];
    for (let i = 0; i < currentStockData.data.length; i++) {
      let inv = currentStockData.data[i];
      invid = inv.product;
      currentQty = inv.currentqty;
      for (let j = 0; j < MaterialOutListData.data.recordList.length; j++) {
        let t = MaterialOutListData.data.recordList[j];
        invid_temp = t.materOuts_product;
        qty_temp = t.qty;
        if (invid == invid_temp) {
          currentQty += qty_temp;
        }
      }
      for (let j = 0; j < storeOutData.data.recordList.length; j++) {
        let t = storeOutData.data.recordList[j];
        invid_temp = t.details_product;
        qty_temp = t.qty;
        if (invid == invid_temp) {
          currentQty += qty_temp;
        }
      }
      for (let j = 0; j < otherOutData.data.recordList.length; j++) {
        let t = otherOutData.data.recordList[j];
        invid_temp = t.othOutRecords_product;
        qty_temp = t.othOutRecords_qty;
        if (invid == invid_temp) {
          currentQty += qty_temp;
        }
      }
      for (let j = 0; j < saleOutData.data.recordList.length; j++) {
        let t = saleOutData.data.recordList[j];
        invid_temp = t.details_product;
        qty_temp = t.qty;
        if (invid == invid_temp) {
          currentQty += qty_temp;
        }
      }
      for (let j = 0; j < otherInData.data.recordList.length; j++) {
        let t = otherInData.data.recordList[j];
        invid_temp = t.othInRecords_product;
        qty_temp = t.othInRecords_qty;
        if (invid == invid_temp) {
          currentQty -= qty_temp;
        }
      }
      for (let j = 0; j < purchaseInData.data.recordList.length; j++) {
        let t = purchaseInData.data.recordList[j];
        invid_temp = t.product;
        qty_temp = t.qty;
        if (invid == invid_temp) {
          currentQty -= qty_temp;
        }
      }
      for (let j = 0; j < storeInData.data.recordList.length; j++) {
        let t = storeInData.data.recordList[j];
        invid_temp = t.details_product;
        qty_temp = t.qty;
        if (invid == invid_temp) {
          currentQty -= qty_temp;
        }
      }
      for (let j = 0; j < prodInData.data.recordList.length; j++) {
        let t = prodInData.data.recordList[j];
        invid_temp = t.storeProRecords_product;
        qty_temp = t.qty;
        if (invid == invid_temp) {
          currentQty -= qty_temp;
        }
      }
      inv.currentqty = currentQty;
      invList[i] = inv;
    }
    //设置时间带时分秒
    function formatDateTime(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    }
    function CallAPI(mode, url, param) {
      //请求头
      var header = { "Content-Type": "application/json" };
      var strResponse = postman(mode, url, JSON.stringify(header), JSON.stringify(param));
      //返回数据
      return strResponse;
    }
    return { invList };
  }
}
exports({ entryPoint: MyAPIHandler });