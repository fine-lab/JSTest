let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { QuoteBillID } = request;
    //根据主报价单id，获取明细表的数据
    let querySql =
      "select StandAmount,StandAmount,StandOverHeight,CarBoxStand,HeavyStand," +
      "Counterpoise,EngineModel,CarBoxModel,CarBoxWallDecorative,CarBoxMidMaterial,HallDoorPocketMaterial," +
      "PowerCutEmergency,DisabledFunction,CompensateChain,Guide,FloorHeightPrice,StandPrice,CarBoxStandPrice," +
      "HeavyStandPrice,CounterpoisePrice,FloorAmountPrice,CarBoxPrice,HallCarDoorPrice,PowerCutEmergencyPrice," +
      "DisabledFunctionPrice,CompensateChainPrice,GuidePrice,OthoerPrice,QouteBillYJ_clFk   " +
      "from GT9154AT5.GT9154AT5.QouteBillYJ_cl where 1=1 and dr = 0";
    if (QuoteBillID != undefined) {
      querySql += " and QuoteBillID = " + QuoteBillID;
    }
    var result = ObjectStore.queryByYonQL(querySql);
    return { result: result };
  }
}
exports({ entryPoint: MyAPIHandler });