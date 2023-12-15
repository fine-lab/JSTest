let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let requestData = request.data;
    if (requestData == null) {
      throw new Error("入参不能为空");
    }
    let lineId = "";
    let sdPeriod = "";
    let atpWk = [];
    requestData.map((item, i) => {
      lineId = item.line_id;
      if (lineId == null) {
        throw new Error("行ID不能为空");
      }
      sdPeriod = item.sd_period;
      if (sdPeriod == null) {
        throw new Error("SD期次不能为空");
      }
      atpWk = item.atp_wk;
      if (atpWk == null) {
        throw new Error("52个月的预测返回数");
      }
    });
    // 查询该行数据
    let sql =
      "select *,main.id as mainId  from AT170EA44616400003.AT170EA44616400003.predictionApiInfoDetail " +
      " left join AT170EA44616400003.AT170EA44616400003.predictionApiInfo main on predictionApiInfo_id = main.id" +
      " where main.sdPeriod = " +
      sdPeriod +
      " and main.id=" +
      lineId +
      " and predictionType= 2";
    var res = ObjectStore.queryByYonQL(sql);
    if (res != null) {
    }
    return { data: "更新完成" };
  }
}
exports({ entryPoint: MyAPIHandler });