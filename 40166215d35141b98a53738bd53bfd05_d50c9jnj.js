let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let code = data[0].code;
    let outSql = "select code,vouchdate,details.firstsource firstsource,details.firstupcode firstupcode,details.firstuplineno firstuplineno,details.qty qty from st.salesout.SalesOut ";
    outSql += " where code = '" + code + "' ";
    outSql += " and details.firstsource = 'udinghuo.voucher_order'";
    let outRes = ObjectStore.queryByYonQL(outSql);
    if (!outRes || outRes.length == 0) {
      return {};
    }
    let salesMap = new Map(); // key=销售订单号_行号，同一个key汇总数量
    let salesCode = []; // 销售订单号
    let outType = "2"; // 是否退货入库，默认是销售出库
    for (let i = 0; i < outRes.length; i++) {
      if (salesMap.has(outRes[i].firstupcode + "_" + outRes[i].firstuplineno)) {
        let qty = salesMap.get(outRes[i].firstupcode + "_" + outRes[i].firstuplineno);
        qty += outRes[i].qty;
        salesMap.set(outRes[i].firstupcode + "_" + outRes[i].firstuplineno, qty);
      } else {
        salesMap.set(outRes[i].firstupcode + "_" + outRes[i].firstuplineno, outRes[i].qty);
      }
      salesCode.push(outRes[i].firstupcode);
      if (i == 0) {
        if (outRes[i].qty < 0) {
          outType = "3"; // 退货入库
        }
      }
    }
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
      if (param.action == "unaudit") {
        // 弃审
        item.isDelete = "Y";
        item.outCount = -outCount;
      } else {
        item.outCount = outCount;
      }
      item.outType = outType;
      item.outCode = code; // 单据编码
      item.outDate = outRes[0].vouchdate; // 出库时间=单据日期
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
    return {};
  }
}
exports({ entryPoint: MyTrigger });