let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var userids = obj.currentUser.id;
    let checkDiffID = request.checkDiffID === undefined || request.checkDiffID === null ? "" : request.checkDiffID; //盘点分析单主键
    let chuliStatus = request.chuliStatus === undefined || request.chuliStatus === null ? "" : request.chuliStatus; //盘点分析单处理状态 1已进行出库处理 2已进行入库处理
    let modify_time = request.modify_time === undefined || request.modify_time === null ? "" : request.modify_time; //分析处理时间
    var ress = checkDiffID.split(",");
    if (ress !== null && ress.length > 0) {
      for (var i = 0; i < ress.length; i++) {
        var objectchuli = {
          id: ress[i],
          status: chuliStatus,
          modifier: userids,
          modify_time: modify_time
        };
        var resuphulue = ObjectStore.updateById("IDX_02.IDX_02.dxq_checkdiff", objectchuli, "9ca4c424");
      }
      return {
        res: "处理成功！"
      };
    } else {
      return {
        res: "参数错误！"
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});