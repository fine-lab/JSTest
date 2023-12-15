// 数量月报表
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 删除报表
    ObjectStore.deleteByMap("AT16F3D57416B00008.AT16F3D57416B00008.JXC_REPORT_AMOUNT", { 1: "1" }, "JXC_REPORT_AMOUNT");
    // 查询所有商品
    let allGoods = ObjectStore.queryByYonQL("select * from AT16F3D57416B00008.AT16F3D57416B00008.JXC_GOODS");
    // 定义年份
    let year = 2022;
    // 定义月份
    let month = 3;
    // 定义报表数组
    let statementArr = [];
    // 定义每个月的天数
    let lastData = { 1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 };
    // 循环配置报表中的每个内容
    for (let i = 0; i <= 2; i++) {
      // 获得对应商品的详细信息
      let good = allGoods[i];
      // 获得对应商品的code编码
      let code = good.CODE;
      // 定义期初数量和期末数量
      let startCount = 0;
      let endCount = 0;
      // 遍历月份
      for (let j = 1; j <= month; j++) {
        let beginTime = year + "-" + prefixInteger(j, 2);
        let saleCountResult = ObjectStore.queryByYonQL("select sum(AMOUNT) from AT16F3D57416B00008.AT16F3D57416B00008.JXC_SHEET_SALE where CODE='" + code + "' AND SHEETDATE like '" + beginTime + "'");
        let saleCount = saleCountResult[0]["AMOUNT"];
        let purchaseCountResult = ObjectStore.queryByYonQL(
          "select sum(AMOUNT) from AT16F3D57416B00008.AT16F3D57416B00008.JXC_SHEET_BUY where CODE='" + code + "' AND SHEETDATE like '" + beginTime + "'"
        );
        let purchaseCount = purchaseCountResult[0]["AMOUNT"];
        if (j != 1) {
          startCount = endCount;
        }
        endCount = startCount + purchaseCount - saleCount;
        // 构造报表记录
        const obj = {
          ZTH: good.ZTH,
          DATE_MIN: beginTime + "-01",
          DATE_MAX: beginTime + "-" + lastData[j + ""],
          CODE: code,
          AMOUNT_INI: startCount,
          AMOUNT_BUY: purchaseCount,
          AMOUNT_SALE: saleCount,
          AMOUNT_END: endCount
        };
        statementArr.push(obj);
      }
    }
    statementArr = statementArr.sort((a, b) => new Date(a.DATE_MIN) - new Date(b.DATE_MIN));
    // 批量保存报表列表
    let res = ObjectStore.insertBatch("AT16F3D57416B00008.AT16F3D57416B00008.JXC_REPORT_AMOUNT", statementArr, "JXC_REPORT_AMOUNT");
    // 返回
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });