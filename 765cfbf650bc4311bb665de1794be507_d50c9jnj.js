let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var tenantId = JSON.parse(AppContext()).currentUser.tenantId;
    let { orders, sum: sumOrder, ifGetPrice, billData } = request;
    let { code: billCode, id: billId, vendor, exchRate } = billData;
    // 判断是否要通过查库获取交易类型
    if (!billData.extend58) {
      let querySql = `select code from bd.bill.TransType where id=${billData.bustype} `;
      var transTypeRes = ObjectStore.queryByYonQL(querySql, "transtype");
      billData.extend58 = transTypeRes[0].code;
    }
    // 判断是否要通过查库获取开票供应商
    if (!billData.extend59) {
      let querySql = `select code from aa.vendor.Vendor where id=${billData.invoiceVendor}`;
      var invoiceVendorRes = ObjectStore.queryByYonQL(querySql, "yssupplier");
      billData.extend59 = invoiceVendorRes[0].code;
    }
    // 判断是否要通过查库获取采购组织
    if (!billData.extend60) {
      let querySql = `select code from org.func.BaseOrg where id=${billData.org} `;
      var orgRes = ObjectStore.queryByYonQL(querySql, "orgcenter");
      billData.extend60 = orgRes[0].code;
    }
    // 判断是否要通过查库获取供货供应商
    if (!billData.extend61) {
      let querySql = `select code from aa.vendor.Vendor where id=${billData.vendor}`;
      var vendorRes = ObjectStore.queryByYonQL(querySql, "yssupplier");
      billData.extend61 = vendorRes[0].code;
    }
    let hasNoOrgOrders = orders.filter((item) => !item.extend114 || !item.extend115);
    let orgIds = hasNoOrgOrders.map((item) => item.inOrg).concat(hasNoOrgOrders.map((item) => item.inInvoiceOrg));
    debugger;
    orgIds = Array.from(new Set(orgIds));
    // 判断是否要查行数据上的收票组织和收获组织
    if (orgIds.length) {
      let querySql = `select id,code from org.func.BaseOrg where id in (${orgIds.join(",")}) `;
      var inOrgRes = ObjectStore.queryByYonQL(querySql, "orgcenter");
      for (let i = 0; i < orders.length; i++) {
        if (!orders[i].extend114) {
          let { inInvoiceOrg } = orders[i];
          let org = inOrgRes.find((item) => item.id === inInvoiceOrg);
          orders[i].extend114 = org.code;
        }
        if (!orders[i].extend115) {
          let { inOrg } = orders[i];
          let org = inOrgRes.find((item) => item.id === inOrg);
          orders[i].extend115 = org.code;
        }
      }
    }
    let hasPriceOrders = orders.filter((item) => item.extend119 && item.extend118);
    // 若该订单已经获价，则先要去批次价格表中执行删除该订单记录的操作
    if (hasPriceOrders.length) {
      let func1 = extrequire("PU.pubFunciton.deleteByOrders");
      let r = func1.execute(hasPriceOrders, vendor, billCode);
    }
    let sql = `select *,(select * from batch_price_detailList) batch_price_detailList from GT18AT2.GT18AT2.batch_price where supplier = '${vendor}' AND verifystate = 2 order by batch_time`;
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    // 需要重写的批次价格数据
    let overrideBatchList = [];
    // 需要重写的采购订单数据
    let overrideOrder = {
      purchaseOrders: [] // 0
    };
    // 打平后的批次价格子表的所有数据
    let flatBatchList = [];
    // 批次价格物料的汇总
    let sumBatch = {};
    for (let item of res) {
      let detailList = item.batch_price_detailList;
      for (let obj of detailList) {
        let { matieral, price_no_tax, price_with_tax, tax_rate_code, tax_race: tax_rate_num, tax_rate, patch_num, ordered_num, remain_num, order_codes, orders_arr, id } = obj;
        flatBatchList.push({
          matieral,
          patch_num,
          ordered_num,
          remain_num,
          price_with_tax,
          price_no_tax,
          tax_rate_code,
          tax_rate_num,
          tax_rate,
          batch_code: item.code, // 批次号
          batch_id: item.id, // 批次价格主表id
          batch_detail_id: id, // 批次价格明细表 行id
          orders_arr: orders_arr ? JSON.parse(orders_arr) : [],
          order_codes,
          changeFlag: false
        });
        if (sumBatch.hasOwnProperty(matieral)) {
          let sum = sumBatch[matieral];
          sum += remain_num;
          sumBatch[matieral] = sum;
        } else {
          sumBatch[matieral] = remain_num;
        }
      }
    }
    // 比对批次价格和采购订单内物料总量
    for (let key in sumOrder) {
      if (sumBatch.hasOwnProperty(key)) {
        let batch = sumBatch[key];
        let order = sumOrder[key].num;
        if (order > batch) {
          throw Error(`采购物料【${sumOrder[key].name}】数量【${order}】大于批次价格表中对应物料数量【${batch}】`);
        }
      } else {
        throw Error(`采购物料【${sumOrder[key].name}】在批次价格表中不存在`);
      }
    }
    // 开始处理需要修改的批次价格数据和采购订单数据
    for (let i = 0; i < orders.length; i++) {
      let { product, qty: num, id } = orders[i];
      overrideOrder.purchaseOrders.push({});
      let status = id ? "Update" : "Insert";
      let index = flatBatchList.findIndex((item) => item.matieral === product && item.remain_num > 0);
      let { batch_id, batch_detail_id, patch_num, remain_num } = flatBatchList[index];
      if (remain_num >= num) {
        flatBatchList[index].remain_num -= num;
        flatBatchList[index].ordered_num += num;
        flatBatchList[index].orders_arr.push({
          [billCode]: id
        });
        // 调用给purchaseOrders[i]填充数据的函数
        structureData(overrideOrder.purchaseOrders[i], orders[i], flatBatchList[index], status, num, exchRate);
      } else {
        structureData(overrideOrder.purchaseOrders[i], orders[i], flatBatchList[index], status, remain_num, exchRate);
        flatBatchList[index].remain_num = 0;
        flatBatchList[index].ordered_num = patch_num;
        flatBatchList[index].orders_arr.push({
          [billCode]: id ? id : undefined // 若此时order是新插入的，还没有id,则用undefined占位
        });
        orders.splice(i + 1, 0, {});
        structureNewOrder(orders[i + 1], orders[i], num - remain_num);
      }
      flatBatchList[index].changeFlag = true;
    }
    // 把billData里的数据同步到overrideOrder里
    overrideOrder.code = billData.code;
    overrideOrder.exchRate = billData.exchRate;
    overrideOrder.currency_code = billData.currency_code;
    overrideOrder.vouchdate = billData.vouchdate;
    overrideOrder.exchRateType = billData.exchRateType;
    overrideOrder.natCurrency_code = billData.natCurrency_code;
    overrideOrder.id = billData.id;
    // 将自定义code字段同步至overrideOrder
    overrideOrder.bustype_code = billData.extend58;
    overrideOrder.invoiceVendor_code = billData.extend59;
    overrideOrder.org_code = billData.extend60;
    overrideOrder.vendor_code = billData.extend61;
    // 对没有填入code字段的单据做填入处理
    overrideOrder.extend58 = billData.extend58;
    overrideOrder.extend59 = billData.extend59;
    overrideOrder.extend60 = billData.extend60;
    overrideOrder.extend61 = billData.extend61;
    overrideOrder.extend57 = true;
    overrideOrder.resubmitCheckKey = new Date().getTime();
    overrideOrder._status = "Update";
    let body = { data: overrideOrder };
    let url = "https://www.example.com/";
    let apiResponse = JSON.parse(openLinker("POST", url, "PU", JSON.stringify(body)));
    if (apiResponse.code !== "200") {
      throw Error(apiResponse.message);
    }
    let newOrder = apiResponse.data.purchaseOrders;
    let changedBatchList = flatBatchList.filter((item) => item.changeFlag);
    changedBatchList.forEach((item) => {
      // 将orders_arr中用undefined占位的部分用newOrder里的真实id占位
      item.orders_arr.forEach((order) => {
        let billCode = Object.keys(order)[0];
        let id = Object.values(order)[0];
        if (id === undefined) {
          let { batch_detail_id } = item;
          let target = newOrder.find((item) => item.extend119 === batch_detail_id && item.extend_ifSplit === true);
          order[billCode] = target.id;
        }
      });
      // 将orders_arr转化为order_codes字段
      let codeArr = item.orders_arr.map((order) => Object.keys(order)[0]);
      codeArr = [...new Set(codeArr)];
      item.order_codes = codeArr.join(",");
      // 将orders_arr转化为字符串，方便保存
      item.orders_arr = JSON.stringify(item.orders_arr);
    });
    for (let item of changedBatchList) {
      let { batch_id, batch_detail_id, remain_num, ordered_num, orders_arr, order_codes } = item;
      debugger;
      let batchItem = overrideBatchList.find((item) => item.id === batch_id);
      if (batchItem) {
        batchItem.order_total += ordered_num;
        batchItem.batch_price_detailList.push({
          id: batch_detail_id,
          remain_num,
          ordered_num,
          orders_arr,
          order_codes,
          _status: "Update"
        });
      } else {
        overrideBatchList.push({
          id: batch_id,
          order_total: ordered_num,
          batch_price_detailList: [
            {
              id: batch_detail_id,
              remain_num,
              ordered_num,
              orders_arr,
              order_codes,
              _status: "Update"
            }
          ]
        });
      }
    }
    debugger;
    overrideBatchList = overrideBatchList.map((item) => {
      let batch = res.find((i) => i.id === item.id);
      let remain_total = 0;
      let changedDetail = item.batch_price_detailList;
      let originDetail = batch.batch_price_detailList;
      for (let detail of originDetail) {
        let hasDetail = changedDetail.find((i) => i.id === detail.id);
        if (hasDetail) {
          remain_total += hasDetail.remain_num;
        } else {
          remain_total += detail.remain_num;
        }
      }
      item.remain_total = remain_total;
      return item;
    });
    let url2 = `https://c1.yonyoucloud.com/iuap-api-gateway/${tenantId}/product_ref/product_ref_01/updateBatchList`;
    let apiResponse2 = openLinker("POST", url2, "PU", JSON.stringify(overrideBatchList));
    return { apiResponse2 };
  }
}
function structureData(purchaseorder, order, flatBatchItem, status, num, exchRate) {
  let { matieral, batch_id, batch_detail_id, patch_num, price_no_tax, price_with_tax, tax_rate, tax_rate_num, tax_rate_code, order_codes, batch_code } = flatBatchItem;
  debugger;
  // 批次号
  purchaseorder.extend118 = batch_code;
  // 记录该条物料取自哪个批次价格明细行
  purchaseorder.extend119 = batch_detail_id;
  // 无税单价
  purchaseorder.oriUnitPrice = price_no_tax;
  // 税率
  purchaseorder.taxRate = tax_rate_num;
  purchaseorder.taxitems_code = tax_rate_code;
  // 含税单价
  purchaseorder.oriTaxUnitPrice = price_with_tax;
  // 含税金额
  purchaseorder.oriSum = (purchaseorder.oriTaxUnitPrice * num).toFixed(2);
  // 税额
  purchaseorder.oriTax = ((purchaseorder.oriUnitPrice * num * purchaseorder.taxRate) / 100).toFixed(2);
  // 无税金额
  purchaseorder.oriMoney = (purchaseorder.oriSum - purchaseorder.oriTax).toFixed(2);
  // 本币无税单价
  purchaseorder.natUnitPrice = price_no_tax * exchRate;
  // 本币含税单价
  purchaseorder.natTaxUnitPrice = price_with_tax * exchRate;
  // 本币无税金额
  purchaseorder.natMoney = purchaseorder.oriMoney * exchRate;
  // 本币含税金额
  purchaseorder.natSum = (purchaseorder.oriSum * exchRate).toFixed(2);
  // 本币税额
  purchaseorder.natTax = purchaseorder.oriTax * exchRate;
  purchaseorder.id = order.id;
  if (status === "Insert") {
    purchaseorder.extend_ifSplit = "1";
  } else {
    purchaseorder.extend_ifSplit = "0";
  }
  // 其他必传字段，沿用orders
  purchaseorder.product_cCode = order.product_cCode;
  purchaseorder.purUOM_Code = order.purUOM_Code;
  purchaseorder.priceUOM_Code = order.priceUOM_Code;
  purchaseorder.invPriceExchRate = order.invPriceExchRate;
  purchaseorder.unit_code = order.unit_code;
  purchaseorder.unitExchangeType = order.unitExchangeType;
  purchaseorder.unitExchangeTypePrice = order.unitExchangeTypePrice;
  purchaseorder.invExchRate = order.invExchRate;
  purchaseorder.extend114 = order.extend114;
  purchaseorder.extend115 = order.extend115;
  purchaseorder.inInvoiceOrg_code = order.extend114;
  purchaseorder.inOrg_code = order.extend115;
  purchaseorder.subQty = num;
  purchaseorder.priceQty = num;
  purchaseorder.qty = num;
  purchaseorder.product = order.product;
  // 更新status字段
  purchaseorder._status = status;
}
function structureNewOrder(newOrder, oldOrder, num) {
  newOrder.product_cCode = oldOrder.product_cCode;
  newOrder.purUOM_Code = oldOrder.purUOM_Code;
  newOrder.priceUOM_Code = oldOrder.priceUOM_Code;
  newOrder.invPriceExchRate = oldOrder.invPriceExchRate;
  newOrder.unit_code = oldOrder.unit_code;
  newOrder.unitExchangeType = oldOrder.unitExchangeType;
  newOrder.unitExchangeTypePrice = oldOrder.unitExchangeTypePrice;
  newOrder.invExchRate = oldOrder.invExchRate;
  newOrder.extend114 = oldOrder.extend114;
  newOrder.extend115 = oldOrder.extend115;
  newOrder.inInvoiceOrg_code = oldOrder.extend114;
  newOrder.inOrg_code = oldOrder.extend115;
  newOrder.subQty = num;
  newOrder.priceQty = num;
  newOrder.qty = num;
  newOrder.product = oldOrder.product;
}
exports({ entryPoint: MyAPIHandler });