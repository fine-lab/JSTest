let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //销售出库来源生单保存
    let url = "https://www.example.com/";
    var apiResponse = openLinker("POST", url, "ST", JSON.stringify({ data: request }));
    var apiResponsejson = JSON.parse(apiResponse);
    // 销售出库审核
    if (apiResponsejson.code != "200") {
      throw new Error(JSON.stringify(apiResponsejson.message));
    }
    if (apiResponsejson.data.sucessCount == 0) {
      throw new Error(apiResponsejson.data.messages);
    }
    let aduitIds = [];
    let salesMap = new Map(); // key=销售订单号_行号，同一个key汇总数量
    let salesCode = []; // 销售订单号
    let outType = "2"; // 是否退货入库，默认是销售出库
    let res = apiResponsejson.data.infos;
    let codeMap = new Map(); // 销售出库单据号
    let vouchdateMap = new Map(); // 销售出库单据日期
    for (var i = 0; i < res.length; i++) {
      let details = res[i].details;
      aduitIds.push({ id: res[i].id });
      for (let z = 0; z < details.length; z++) {
        if (salesMap.has(details[z].firstupcode + "_" + details[z].firstuplineno)) {
          let qty = salesMap.get(details[z].firstupcode + "_" + details[z].firstuplineno);
          qty += details[z].qty;
          salesMap.set(details[z].firstupcode + "_" + details[z].firstuplineno, qty);
        } else {
          salesMap.set(details[z].firstupcode + "_" + details[z].firstuplineno, details[z].qty);
        }
        salesCode.push(details[z].firstupcode);
        codeMap.set(details[z].firstupcode, res[i].code);
        vouchdateMap.set(details[z].firstupcode, res[i].vouchdate);
        if (i == 0) {
          if (details[z].qty < 0) {
            outType = "3"; // 退货入库
          }
        }
      }
    }
    url = "https://www.example.com/";
    apiResponse = openLinker("POST", url, "ST", JSON.stringify({ data: aduitIds }));
    apiResponsejson = JSON.parse(apiResponse);
    if (apiResponsejson.code != 200) {
      throw new Error(apiResponsejson.message);
    }
    if (apiResponsejson.data.sucessCount == 0) {
      throw new Error(JSON.stringify(apiResponsejson.data.messages));
    }
    // 销售出库回写囤货出库指令
    let saleSql = "select code,orderDetails.extendOutId extendOutId,orderDetails.extendOutItem extendOutItem,orderDetails.lineno lineno from voucher.order.Order ";
    saleSql += " where code in ('" + salesCode.join("','") + "') ";
    saleSql += " and orderDetails.extendOutId is not null ";
    let saleRes = ObjectStore.queryByYonQL(saleSql, "udinghuo");
    if (!saleRes || saleRes.length == 0) {
      return {};
    }
    let sendData = { outType: outType }; // 单据类型=销售出库
    let result = []; // 结果数据
    let sameMap = new Map(); // 同一囤货指令，合在一起
    for (let j = 0; j < saleRes.length; j++) {
      if (!salesMap.has(saleRes[j].code + "_" + saleRes[j].lineno)) {
        continue;
      }
      let extendOutFlag = saleRes[j].extendOutId.split("@_@");
      let item = {};
      let outCount = salesMap.get(saleRes[j].code + "_" + saleRes[j].lineno);
      item.outCount = outCount;
      item.outType = outType;
      item.outCode = codeMap.get(saleRes[j].code); // 单据编码
      item.outDate = vouchdateMap.get(saleRes[j].code); // 出库时间=单据日期
      item.extendOutId = saleRes[j].extendOutId; // 囤货出库关联标识
      item.extendOutItem = saleRes[j].extendOutItem; // 物料ID
      if (!sameMap.has(saleRes[j].extendOutId)) {
        sameMap.set(saleRes[j].extendOutId, item);
      } else {
        let oldItem = sameMap.get(saleRes[j].extendOutId);
        oldItem.outCount += item.outCount;
        sameMap.set(saleRes[j].extendOutId, oldItem);
      }
    }
    sameMap.forEach((value, key) => {
      result.push(value);
    });
    if (result.length > 0) {
      sendData.result = result;
      // 调接口回写数据
      let env = ObjectStore.env();
      let tenantid = env.tenantId;
      let url = "https://www.example.com/" + tenantid + "/product_ref/product_ref_01/updateOutApi";
      let response = openLinker("POST", url, "SCMSA", JSON.stringify({ data: sendData }));
      response = JSON.parse(response);
      if (response.code != "200") {
        throw new Error("同步囤货出库数量出错！请联系管理员！");
      }
    }
    return { message: "销售出库来源生单保存并自动审核成功", id: apiResponsejson.data.infos[0].id };
  }
}
exports({ entryPoint: MyAPIHandler });