let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    console.log("123");
    var id = param.data[0].id;
    let UpdateClue = extrequire("ACT.FollowRecord.UpdateClue");
    let updateBody = {
      fullname: "sfa.oppt.Oppt",
      data: [
        {
          id: id,
          closeReason: 2386372613643191, //关闭原因 参照档案
          closeRemark: "赢单关闭!" //最新跟进时间
        }
      ]
    };
    let res;
    try {
      res = UpdateClue.execute(updateBody);
    } catch (e) {
      throw new Error(e);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });