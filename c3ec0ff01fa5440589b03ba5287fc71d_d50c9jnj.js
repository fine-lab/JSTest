let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let retData = {};
    let dataList = request.data;
    if (!dataList || dataList.length == 0) {
      throw new Error("数据校验失败，原因：请求参数为空！");
    }
    let dataForUpdate = [];
    let allProductCode = [];
    dataList.map((item) => {
      let stockObj = {
        suppItemCode: item.product_code,
        regionType: item.country_type,
        stock: item.stock,
        lastWeekStockin: item.last_week_stockin,
        stokein: item.stokein,
        currenProcessQty: item.curren_process_qty,
        deliveryDate: item.delivery_date,
        dailyCapacity: item.daily_capacity,
        outputtedOfDay: item.outputtedOfDay,
        manufacturingQuantityOfDay: item.manufacturingQuantityOfDay,
        inventory: item.inventory,
        actualCapacityOfMonth: item.actualCapacityOfMonth,
        leadTime: item.leadTime,
        outputRolledYield: item.outputRolledYield,
        productionPeriod: item.productionPeriod
      };
      allProductCode.push(item.product_code);
      dataForUpdate.push(stockObj);
    });
    let stockInsertLocalFunc = extrequire("AT173E4CEE16E80007.StockUpdate.stockInsertLocal");
    let res = stockInsertLocalFunc.execute({ data: dataForUpdate, allProductCode: allProductCode });
    if (res.success) {
      let dataForPush = res.data;
      let pushStockForSFunc = extrequire("AT173E4CEE16E80007.StockUpdate.pushStockForS");
      let resForS = pushStockForSFunc.execute(dataForPush);
      //查询出需要同步的数据 add by chaigb start
      //查询出需要同步的数据 add by chaigb end
      if (!resForS.success) {
        //将错误信息和标识记录到SS库存记录表
        let stockUpdateFunc = extrequire("AT173E4CEE16E80007.StockUpdate.stockUpdate");
        let res = stockUpdateFunc.execute({ data: dataForPush, pushFlagS: false, errorMessage: resForS.message });
      }
      retData["errorList"] = (res && res.errorList) || [];
    } else {
      throw new Error("保存失败，原因：" + res.message.substring(0, 199));
    }
    //构建api接口返回的参数
    return retData;
  }
}
exports({ entryPoint: MyAPIHandler });