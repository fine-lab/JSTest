let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.return;
    // 获取主表id
    var id = param.return.id;
    // 给字段赋初始值零
    var installationGroupAmount1 = 0;
    var amountAvailableInAdvance = 0;
    var amountAdvanced1 = 0;
    var amountOfAdvanceThisTime1 = 0;
    var pid = "";
    var amountInTotal = 0;
    var amountOfAdvanceThisTime = 0;
    var amountAdvanced = 0;
    var workNumberAmountAdvanced = 0;
    // 获取子表集合
    //根据id查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where advanceInformationSheet_id = '" + id + "'and dr = 0";
    var List = ObjectStore.queryByYonQL(sql1);
    var flag = data.hasOwnProperty("advanceInformationSheetDetailList");
    if (List.length != 0) {
      // 遍历子表集合
      for (var i = 0; i < List.length; i++) {
        if (List[i].amountOfAdvanceThisTime != null) {
          //获取本次预支金额
          amountOfAdvanceThisTime = List[i].amountOfAdvanceThisTime;
        }
        // 获取合计金额
        amountInTotal = amountInTotal + amountOfAdvanceThisTime;
        // 获取子表id
        pid = List[i].id;
        if (List[i].installationGroupAmount != null) {
          // 获取可预支金额
          amountAvailableInAdvance = List[i].installationGroupAmount * 0.7;
        }
        if (List[i].amountAdvanced != null) {
          //获取已预支金额
          amountAdvanced = List[i].amountAdvanced;
        }
        //计算工号合计金额
        workNumberAmountAdvanced = amountOfAdvanceThisTime + amountAdvanced;
        // 更新子表条件
        var updateWrapper1 = new Wrapper();
        updateWrapper1.eq("id", pid);
        // 待更新字段内容
        var toUpdate1 = { amountAvailableInAdvance: amountAvailableInAdvance, workNumberAmountAdvanced: workNumberAmountAdvanced };
        // 执行更新
        var res1 = ObjectStore.update("GT102917AT3.GT102917AT3.advanceInformationSheetDetail", toUpdate1, updateWrapper1, "1a55f13d");
      }
    }
    // 更新主表条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", id);
    // 待更新字段内容
    var toUpdate = { amountInTotal: amountInTotal };
    // 执行更新
    var res = ObjectStore.update("GT102917AT3.GT102917AT3.advanceInformationSheet", toUpdate, updateWrapper, "1e3ef2af");
    return {};
  }
}
exports({ entryPoint: MyTrigger });