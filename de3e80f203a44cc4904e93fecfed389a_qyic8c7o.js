let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const sql =
      "select id,code,opptDate,name,expectSignMoney,org,opptState,opptTransType,winningRate,customer, d.define18 signState,expectSignDate,expectSignMoney from sfa.oppt.Oppt left join sfa.oppt.OpptDef d on id = d.id  where opptState!=3 and d.define18='已签约' limit 0,100000";
    const res = ObjectStore.queryByYonQL(sql);
    const sql2 = "select * from sfa.process.Process";
    const res2 = ObjectStore.queryByYonQL(sql2);
    let arr = [];
    res.forEach((item) => {
      const expectSignDate = +new Date(item.expectSignDate);
      const nowDate = +new Date();
      // 如果当前时间大于预计签约时间15天
      if (nowDate > expectSignDate + 15 * 24 * 3600 * 1000) {
        var object = {
          id: item.id,
          opptState: 3,
          winLoseOrderState: 0,
          opptTransType: item.opptTransType,
          org: item.org,
          closeReason: 2386372613643191, //关闭原因 参照档案
          closeRemark: "赢单关闭!" //最新跟进时间
        };
        if (item.code == "CHAN00078634") {
          arr.push(object);
        }
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
      res2,
      arr,
      apiResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});