let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
    var data = param.data[0];
    var clueId = data.clue; //线索ID
    var followContext = data.followContext; //跟进内容
    var followTime = formatDate(new Date(data.followTime)); //跟进日期
    var ower_name = data.ower_name; //负责人
    let UpdateClue = extrequire("ACT.FollowRecord.UpdateClue");
    let updateBody = {
      fullname: "sfa.clue.ClueDef",
      data: [
        {
          id: clueId,
          define16: followContext, //最新跟进记录
          define19: followTime, //最新跟进时间
          define18: ower_name //负责人
        }
      ]
    };
    let res2 = UpdateClue.execute(updateBody);
    return res2;
  }
}
exports({ entryPoint: MyTrigger });