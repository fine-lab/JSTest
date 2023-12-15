let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    //插入日志
    //单据状态：Insert，Update
    let _status = pdata._status;
    let xiangDuiFangIds = "";
    let htxdfxxList = [];
    htxdfxxList = pdata.htxdfxxList;
    if (htxdfxxList != null && htxdfxxList.length > 0) {
    }
    return true;
  }
}
exports({ entryPoint: MyTrigger });