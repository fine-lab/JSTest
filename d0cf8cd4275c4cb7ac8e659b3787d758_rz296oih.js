let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //声明返回信息
    var retData = {
      //是否成功的标识
      success: true,
      //错误信息
      message: "",
      data: []
    };
    let objectDetails = [];
    let objectDetailDate = { predictionType: 0, wk01: "2023-01-13", wk02: "2023-01-20", wk03: "2023-01-27" };
    let objectDetailQty = { predictionType: 1, wk01: "100", wk02: "190", wk03: "300" };
    objectDetails.push(objectDetailDate);
    objectDetails.push(objectDetailQty);
    let object = {
      sdMaterialCode: "sku0011",
      sdCodeRemark: "test",
      sdCodeStatus: "开立",
      sdPeriod: "2023-01-23",
      predictionRegion: "国内",
      sProductClassification: "风冷",
      status: "1",
      predictionApiInfoDetailList: objectDetails
    };
    //调用实体操作，对实体进行插入
    var res = ObjectStore.insert("AT170EA44616400003.AT170EA44616400003.predictionApiInfo", object, "yb170e3dc8");
    //根据执行结果，构建返回值
    retData.data.push(res);
    return { retData };
  }
}
exports({ entryPoint: MyAPIHandler });