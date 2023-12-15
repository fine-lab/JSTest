let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { sum: sumOrder, ifGetPrice, billData } = request;
    let { purchaseOrders: orders, code: billCode, id: billId, vendor, exchRate } = billData;
    // 若该订单已经获价，则先要去批次价格表中执行删除该订单记录的操作
    if (ifGetPrice === "1") {
      let func1 = extrequire("PU.pubFunciton.deleteByOrders");
      let r = func1.execute(orders, vendor, billCode);
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
        let { matieral, price_no_tax, price_with_tax, tax_rate_code, tax_race: tax_rate_num, tax_rate, patch_num, order_num, remain_num, order_codes, order_arr, id } = obj;
        flatBatchList.push({
          matieral,
          patch_num,
          order_num: order_num ? order_num : 0,
          remain_num,
          price_with_tax,
          price_no_tax,
          tax_rate_code,
          tax_rate_num,
          tax_rate,
          batch_id: item.id, // 批次价格主表id
          batch_detail_id: id, // 批次价格明细表 行id
          order_arr: order_arr ? JSON.parse(order_arr) : [],
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
          throw Error(`采购物料【${sumOrder[key].name}】数量大于批次价格表中对应物料数量`);
        }
      } else {
        throw Error(`采购物料【${sumOrder[key].name}】在批次价格表中不存在`);
      }
    }
    // 开始处理需要修改的批次价格数据和采购订单数据
    for (let i = 0; i < orders.length; i++) {
      let { product, qty: num, id, _status } = orders[i];
      overrideOrder.purchaseOrders.push({});
      let status = _status === "addOrder" ? "Insert" : "Update";
      let index = flatBatchList.findIndex((item) => item.matieral === product && item.remain_num > 0);
      let { batch_id, batch_detail_id, patch_num, remain_num } = flatBatchList[index];
      if (remain_num >= num) {
        flatBatchList[index].remain_num -= num;
        flatBatchList[index].order_num += num;
        flatBatchList[index].order_arr.push({
          [billCode]: id
        });
        // 调用给purchaseOrders[i]填充数据的函数
        structureData(overrideOrder.purchaseOrders[i], orders[i], flatBatchList[index], status, num, exchRate);
      } else {
        structureData(overrideOrder.purchaseOrders[i], orders[i], flatBatchList[index], status, remain_num, exchRate);
        flatBatchList[index].remain_num = 0;
        flatBatchList[index].order_num = patch_num;
        flatBatchList[index].order_arr.push({
          [billCode]: id ? id : undefined // 若此时order是新插入的，还没有id,则用undefined占位
        });
        orders.splice(i + 1, 0, {});
        structureData(orders[i + 1], orders[i], flatBatchList[index], "addOrder", num - remain_num);
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
    overrideOrder.bustype_code = billData.extend60;
    overrideOrder.invoiceVendor_code = billData.extend61;
    overrideOrder.org_code = billData.extend62;
    overrideOrder.vendor_code = billData.extend63;
    overrideOrder.resubmitCheckKey = "yourKeyHere";
    overrideOrder._status = "Update";
    let body = { data: overrideOrder };
    let url = "https://www.example.com/";
    let apiResponse = JSON.parse(openLinker("POST", url, "GT18AT2", JSON.stringify(body)));
    if (apiResponse.code !== "200") {
      throw Error(apiResponse.message);
    }
    let newOrder = apiResponse.data.purchaseOrders;
    let changedBatchList = flatBatchList.filter((item) => item.changeFlag);
    debugger;
    changedBatchList.forEach((item) => {
      // 将order_arr中用undefined占位的部分用newOrder里的真实id占位
      item.order_arr.forEach((order) => {
        let billCode = Object.keys(order)[0];
        let id = Object.values(order)[0];
        if (id === undefined) {
          let { batch_detail_id } = item;
          let target = newOrder.find((item) => item.batchno === batch_detail_id && item.extend_ifSplit === true);
          order[billCode] = target.id;
        }
      });
      // 将order_arr转化为order_codes字段
      let codeArr = item.order_arr.map((order) => Object.keys(order)[0]);
      codeArr = [...new Set(codeArr)];
      item.order_codes = codeArr.join(",");
      // 将order_arr转化为字符串，方便保存
      item.order_arr = JSON.stringify(item.order_arr);
    });
    debugger;
    for (let item of changedBatchList) {
      let { batch_id, batch_detail_id, remain_num, ordered_num, order_arr, order_codes } = item;
      let batchItem = overrideBatchList.find((item) => item.id === batch_id);
      if (batchItem) {
        batchItem.remain_total += remain_num;
        batchItem.batch_price_detail.push({
          id: batch_detail_id,
          remain_num,
          ordered_num,
          order_arr,
          order_codes,
          _status: "Update"
        });
      } else {
        overrideBatchList.push({
          id: batch_id,
          remain_total: remain_num,
          _status: "Update",
          batch_price_detail: [
            {
              id: batch_detail_id,
              remain_num,
              ordered_num,
              order_arr,
              order_codes,
              _status: "Update"
            }
          ]
        });
      }
    }
    let func2 = extrequire("PU.pubFunciton.getToken");
    let token = func2.execute("8c12ebe43a014995b4dd4ade53b069a7", "2ee95c6c34e948a9b31e75708b5083a1");
    let url2 = "https://www.example.com/";
    debugger;
    return { apiResponse2 };
  }
}
function structureData(purchaseorder, order, flatBatchItem, status, num, exchRate) {
  let { matieral, batch_id, batch_detail_id, patch_num, price_no_tax, price_with_tax, tax_rate, tax_rate_num, tax_rate_code, order_codes } = flatBatchItem;
  if (status !== "addOrder") {
    // 记录该条物料取自哪个批次价格明细行
    purchaseorder.batchno = batch_detail_id;
    // 无税单价
    purchaseorder.oriUnitPrice = price_no_tax;
    // 税率
    purchaseorder.taxRate = tax_rate_num;
    purchaseorder.taxitems_code = tax_rate_code;
    // 含税单价
    purchaseorder.oriTaxUnitPrice = price_with_tax;
    // 无税金额
    purchaseorder.oriMoney = purchaseorder.oriUnitPrice * num;
    // 含税金额
    purchaseorder.oriSum = purchaseorder.oriTaxUnitPrice * num;
    // 税额
    purchaseorder.oriTax = purchaseorder.oriSum - purchaseorder.oriMoney;
    // 本币无税单价
    purchaseorder.natUnitPrice = price_no_tax * exchRate;
    // 本币含税单价
    purchaseorder.natTaxUnitPrice = price_with_tax * exchRate;
    // 本币无税金额
    purchaseorder.natMoney = purchaseorder.oriMoney * exchRate;
    // 本币含税金额
    purchaseorder.natSum = purchaseorder.oriSum * exchRate;
    // 本币税额
    purchaseorder.natTax = purchaseorder.oriTax * exchRate;
    purchaseorder.id = order.id;
  }
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
exports({ entryPoint: MyAPIHandler });