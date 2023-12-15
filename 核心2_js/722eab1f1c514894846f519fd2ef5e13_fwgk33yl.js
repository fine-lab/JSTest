let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const sql =
      "select id,code,opptDate,name,expectSignMoney,org,opptState,opptTransType,winningRate,customer, d.define2 signState,expectSignDate,expectSignMoney from sfa.oppt.Oppt left join sfa.oppt.OpptDef d on id = d.id  where opptState!=3 and d.define2='已签约'";
    const res = ObjectStore.queryByYonQL(sql);
    let arr = [];
    res.forEach((item) => {
      const expectSignDate = +new Date(item.expectSignDate);
      const nowDate = new Date();
      // 如果当前时间大于预计签约时间15天
      if (nowDate > expectSignDate + 15 * 24 * 3600 * 1000) {
        var object = {
          winOrderMoney: String(item.expectSignMoney),
          expectSignMoney: item.expectSignMoney,
          id: Number(item.id),
          code: item.code,
          name: item.name,
          customer: item.customer,
          opptDate: item.opptDate,
          _status: "Update",
          opptState: 3,
          winLoseOrderState: 0,
          winningRate: item.winningRate,
          opptTransType: item.opptTransType,
          org: item.org,
          winOrderDate: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
          closeReason: 2386372613643191, //关闭原因 参照档案
          closeRemark: "赢单关闭!" //最新跟进时间
        };
        arr.push(object);
      }
    });
    let UpdateClue = extrequire("ACT.FollowRecord.UpdateClue");
    let updateBody = {
      fullname: "sfa.oppt.Oppt",
      data: arr
    };
    let apiResponse;
    try {
      apiResponse = UpdateClue.execute(updateBody);
    } catch (e) {
      throw new Error(e);
    }
    return {
      res,
      arr,
      apiResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});