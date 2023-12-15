let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 调华为接口拉取数据并下推供应商
    let message = "";
    // 调华为接口拉取数据
    let getFSFunc = extrequire("AT173E4CEE16E80007.xqycxr.forecastForSs");
    let getFSRes = getFSFunc.execute({});
    if (getFSRes.code != "200") {
      throw new Error("华为云供需匹配查询服务异常：" + res.message);
    }
    message = message + "调用华为云供需匹配查询服务成功;";
    // 如果调用成功构造数据写入本地
    let insertDRes = null;
    try {
      let insertDFunc = extrequire("AT173E4CEE16E80007.xqycxr.insertDemandInfo");
      insertDRes = insertDFunc.execute(getFSRes.data || []);
    } catch (err) {
      throw new Error(message + "华为云供需本地写入异常：" + err);
    }
    message = message + "华为云供需本地写入成功;";
    // 数据推送给供应商
    let forHtFunc = extrequire("AT173E4CEE16E80007.xqycxr.forcastForHt");
    let forHtRes = forHtFunc.execute(insertDRes || []);
    if (forHtRes.status != "success") {
      throw new Error(message + "华为云供需下推供应商异常：" + forHtRes.message);
    } else {
      message = message + "华为云供需下推供应商成功;";
    }
    return { message };
  }
}
exports({ entryPoint: MyAPIHandler });