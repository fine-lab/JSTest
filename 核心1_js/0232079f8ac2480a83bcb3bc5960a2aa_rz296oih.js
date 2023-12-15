let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取接口请求的数据信息
    //校验数据信息
    //根据数据信息构建采购预测库存实体的数据结构
    //调用后端函数进行数据校验和更新
    //将数据同步至华为系统
    let dataForPush = { key: "yourkeyHere" };
    let pushStockForSFunc = extrequire("AT170EA44616400003.StockUpdate.pushStockForS");
    let resForS = pushStockForSFunc.execute(dataForPush);
    if (!resForS.success) {
      throw new Error("同步HW系统失败，原因：" + resForS.message);
    }
    //构建api接口返回的参数
    let retData = resForS;
    return retData;
  }
}
exports({ entryPoint: MyAPIHandler });