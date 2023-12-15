let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var clueId = 2534691371634944; //data.clue;//线索ID
    var followContext = "测试回写4.0"; //data.followContext;//跟进内容
    let UpdateClue = extrequire("ACT.FollowRecord.UpdateClue");
    let updateBody = {
      fullname: "sfa.clue.ClueDef",
      data: [
        {
          id: clueId,
          define11: followContext
        }
      ]
    };
    let res2 = UpdateClue.execute(updateBody);
    return res2;
  }
}
exports({ entryPoint: MyAPIHandler });