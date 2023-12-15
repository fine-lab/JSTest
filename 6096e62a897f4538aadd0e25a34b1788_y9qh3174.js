// 根据系统选择的月末一次加权平均计价法，计算成本单价表
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 删除报表
    ObjectStore.deleteByMap("AT16F3D57416B00008.AT16F3D57416B00008.jxc_goods_price", { 1: "1" }, "jxc_goods_price");
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
    // 定义税率
    let rTax = 1.13;
    // 循环每个商品
    for (let i = 0; i <= 2; i++) {
      let good = allGoods[i];
      // 初始化本期期初金额(首月的存货单位成本为0)
      let moneInt = 0;
      let price = 0;
      // 遍历月份
      for (let j = 1; j <= month; j++) {
        // 账套号
        let zth = good.ZTH;
        //起始日期
        let beginTime = year + "-" + prefixInteger(j, 2);
        let dateMin = beginTime + "-01";
        //结束日期
        let dateMax = beginTime + "-" + lastData[j + ""];
        //商品编码
        let code = good.CODE;
        // 存货单位成本
        let amountIniArray = ObjectStore.queryByYonQL("select AMOUNT_INI from AT16F3D57416B00008.AT16F3D57416B00008.JXC_REPORT_AMOUNT where CODE='" + code + "' AND DATE_MIN = '" + dateMin + "'");
        let amountIni = amountIniArray[0]["AMOUNT_INI"];
        let amountEndArray = ObjectStore.queryByYonQL("select AMOUNT_END from AT16F3D57416B00008.AT16F3D57416B00008.JXC_REPORT_AMOUNT where CODE='" + code + "' AND DATE_MIN = '" + dateMin + "'");
        let amountEnd = amountEndArray[0]["AMOUNT_END"];
        let amountArray = ObjectStore.queryByYonQL("select AMOUNT from AT16F3D57416B00008.AT16F3D57416B00008.JXC_SHEET_BUY where CODE='" + code + "' AND SHEETDATE like '" + beginTime + "'");
        let amount = amountArray[0]["AMOUNT"];
        let moneArray = ObjectStore.queryByYonQL("select MONE from AT16F3D57416B00008.AT16F3D57416B00008.JXC_SHEET_BUY where CODE='" + code + "' AND SHEETDATE like '" + beginTime + "'");
        let mone = moneArray[0]["MONE"] / rTax;
        if (j != 1) {
          moneInt = amountEnd * price;
        }
        price = (moneInt + mone) / (amountIni + amount);
        // 构造成本单价表记录
        const obj = {
          zth: zth,
          date_min: dateMin,
          date_max: dateMax,
          code: code,
          price: price
        };
        costArr.push(obj);
      }
    }
    //对结果进行排序
    costArr = costArr.sort((a, b) => {
      return new Date(a.date_min) - new Date(b.date_min);
    });
    // 批量保存
    let res = ObjectStore.insertBatch("AT16F3D57416B00008.AT16F3D57416B00008.jxc_goods_price", costArr, "jxc_goods_price");
    // 返回
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });