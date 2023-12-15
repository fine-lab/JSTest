let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    if (typeof data.arrivalOrders[0] == "undefined" || data.arrivalOrders[0] === null) {
      throw new Error("表体行为空！");
    }
    let billNum = data.arrivalOrders[0].qty;
    // 蓝字单据拦截，红字单据直接放行
    if (billNum < 0) {
      return {};
    }
    //组织查询参数
    let { purchaseOrg, vendor } = data;
    var supplyDocIds = [];
    supplyDocIds.push(vendor);
    //准备匹配参数
    var objectArr = [];
    let { arrivalOrders } = data;
    for (var i = 0; i <= arrivalOrders.length - 1; i++) {
      let { product, productsku, producedate } = arrivalOrders[i];
      //如果生产日期为空则不加入校验数组
      if (typeof producedate == "undefined" || producedate === null) {
        continue;
      }
      var checkKey = purchaseOrg + vendor + product + productsku; //采购组织+供应商+物料+SKU
      var tempRow = i + 1;
      var readKey = checkKey + "-" + tempRow;
      var obb = { readKey: readKey, producedate: producedate };
      objectArr.push(obb);
    }
    //请求头
    let header = {
      appkey: "yourkeyHere",
      appsecret: "yoursecretHere"
    };
    let body = { organizationId: purchaseOrg, supplyDocIds: supplyDocIds };
    let url = "https://www.example.com/";
    let apiResponse = ublinker("POST", url, JSON.stringify(header), JSON.stringify(body));
    let supplycategorys = JSON.parse(apiResponse);
    var resArray = supplycategorys.data;
    var errorMsg = "";
    if (resArray === null) {
      //没有寻到，直接放行
      return {};
    } else {
      //数据整理
      for (var j = 0; j <= resArray.length - 1; j++) {
        //返回数据的key【采购组织+供应商+物料+SKU】
        var resKey = purchaseOrg + vendor + resArray[j].materialId + resArray[j].materialSkuId;
        for (var k = 0; k <= objectArr.length - 1; k++) {
          var arr = objectArr[k].readKey.split("-");
          var bornDate = objectArr[k].producedate; //生产日期
          var checkKeyTemp = arr[0]; //采购组织+供应商+物料+SKU
          var rowNumTemp = arr[1]; //行号
          if (resKey === checkKeyTemp) {
            if (typeof bornDate == "undefined" || bornDate === null) {
              continue;
            }
            var date = resArray[j]["defines!define1"]; //物料资质效期
            var validtime = new Date(date).getTime();
            if (validtime < bornDate) {
              errorMsg = errorMsg + "第" + rowNumTemp + "行 物料存在过期资质，请检查；";
            }
          }
        }
      }
      //抛出全部有问题行
      if (errorMsg !== "") {
        throw new Error(errorMsg);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });