// 金额月报表
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 删除报表
    ObjectStore.deleteByMap("AT16F3D57416B00008.AT16F3D57416B00008.JXC_REPORT_MONE", { 1: "1" }, "JXC_REPORT_MONE");
    // 定义年份
    let year = 2022;
    // 定义月份
    let month = 3;
    // 查询所有商品
    let allGoods = ObjectStore.queryByYonQL("select * from AT16F3D57416B00008.AT16F3D57416B00008.JXC_GOODS");
    // 定义成本单价表数组
    let costArr = [];
    // 定义每个月的天数
    let lastData = { 1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 };
    // 循环每个商品
    for (let i = 0; i <= 2; i++) {
      let good = allGoods[i];
      // 初始化本期期初金额
      let moneIni = 0;
      let moneEnd = 0;
      // 遍历月份
      for (let j = 1; j <= month; j++) {
        // 账套号
        let zth = good.ZTH;
        //起始日期和结束日期
        let beginTime = year + "-" + prefixInteger(j, 2);
        let dateMin = beginTime + "-01";
        let dateMax = beginTime + "-" + lastData[j + ""];
        //商品编码
        let code = good.CODE;
        //非首月需要更新期初金额
        if (j != 1) {
          moneIni = moneEnd;
        }
        //结存金额
        let amountEndArray = ObjectStore.queryByYonQL("select AMOUNT_END from AT16F3D57416B00008.AT16F3D57416B00008.JXC_REPORT_AMOUNT where CODE='" + code + "' AND DATE_MIN = '" + dateMin + "'");
        let amountEnd = amountEndArray[0]["AMOUNT_END"];
        let priceArray = ObjectStore.queryByYonQL("select price from AT16F3D57416B00008.AT16F3D57416B00008.jxc_goods_price where code='" + code + "' AND date_min = '" + dateMin + "'");
        let price = priceArray[0]["price"];
        moneEnd = amountEnd * price;
        //采购金额（采购单）
        let moneBuyArray = ObjectStore.queryByYonQL("select MONE from AT16F3D57416B00008.AT16F3D57416B00008.JXC_SHEET_BUY where CODE='" + code + "' AND SHEETDATE like '" + beginTime + "'");
        let moneBuy = moneBuyArray[0]["MONE"];
        //销售金额（销售单）
        let moneSaleArray = ObjectStore.queryByYonQL("select MONE from AT16F3D57416B00008.AT16F3D57416B00008.JXC_SHEET_SALE where CODE='" + code + "' AND SHEETDATE like '" + beginTime + "'");
        let moneSale = moneSaleArray[0]["MONE"];
        // 构造进销存金额月报表
        const obj = {
          ZTH: zth,
          DATE_MIN: dateMin,
          DATE_MAX: dateMax,
          CODE: code,
          MONE_INI: moneIni,
          MONE_BUY: moneBuy,
          MONE_SALE: moneSale,
          MONE_END: moneEnd
        };
        costArr.push(obj);
      }
    }
    //对结果进行排序
    costArr = costArr.sort((a, b) => new Date(a.DATE_MIN) - new Date(b.DATE_MIN));
    // 批量保存
    let res = ObjectStore.insertBatch("AT16F3D57416B00008.AT16F3D57416B00008.JXC_REPORT_MONE", costArr, "JXC_REPORT_MONE");
    // 返回
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });