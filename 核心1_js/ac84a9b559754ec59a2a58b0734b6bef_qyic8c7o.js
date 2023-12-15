let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let source_hid = request.source_hid;
    let source_bid = request.source_bid;
    let suggestion = request.suggestion;
    let new_score = request.new_score;
    let new_score_percent = request.new_score_percent;
    if (!source_hid || !source_bid) {
      return {};
    }
    var bparam = { source_id: source_hid, sourcechild_id: source_bid };
    var res = ObjectStore.selectByMap("GT65292AT10.GT65292AT10.Presales_feedback", bparam);
    if (res && res.length > 0) {
      let uparam = [];
      for (let inum = 0; inum < res.length; inum++) {
        uparam.push({
          id: res[inum].id,
          isuggestion: suggestion, //销售评价
          new_score_percent: new_score_percent, //百分制评分
          new_score: new_score //加权评分
        });
      }
      ObjectStore.updateBatch("GT65292AT10.GT65292AT10.Presales_feedback", uparam);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });