let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let childId = request.childId; //申请-反馈子表主键
    let content = request.content; //反馈内容
    let attachment = request.attachment; //附件
    let actual_support_time = request.actual_support_time;
    let actual_support_endtime = request.actual_support_endtime;
    var obj = {
      id: id,
      PresaleA_1List: [
        {
          id: childId,
          fujian: attachment,
          PreSaleFeedback: content,
          actual_support_endtime: actual_support_endtime,
          actual_support_time: actual_support_time,
          _status: "Update"
        }
      ]
    };
    var fkSql = "select def1 from GT65292AT10.GT65292AT10.Presales_feedback where source_id = '" + request.id + "'";
    var fkRes = ObjectStore.queryByYonQL(fkSql);
    if (fkRes && fkRes.length > 0) {
      var submitCount = 0;
      for (var i in fkRes) {
        if (fkRes[i].def1 == 2) {
          submitCount++;
        }
      }
      if (submitCount == fkRes.length) {
        var preSql = "select verifystate from GT65292AT10.GT65292AT10.PresaleAppon where id = '" + request.id + "'";
        var preRes = ObjectStore.queryByYonQL(preSql);
        if (preRes && preRes.length > 0) {
          //将已审核的状态变为待评分
          if (preRes[0].verifystate == 2) {
            obj.verifystate = 5;
          }
        }
      }
    }
    var res = ObjectStore.updateById("GT65292AT10.GT65292AT10.PresaleAppon", obj);
    return {
      res
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});