let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取子表集合
    var advanceInformationSheetDetailList = param.data[0].advanceInformationSheetDetailList;
    //获取合同号
    var contractNumber = param.data[0].contractNumber;
    //获取预支类型
    var advanceType = param.data[0].advanceType;
    //查询预支信息表获取主表id
    var sql1 = "select id from GT102917AT3.GT102917AT3.advanceInformationSheet where contractNumber = '" + contractNumber + "'and advanceType = '" + advanceType + "'";
    var List = ObjectStore.queryByYonQL(sql1);
    var sum = 0;
    if (List.length > 0) {
      for (var i = 0; i < List.length; i++) {
        //通过主表id查询预支信息表子表生产工号
        var sql2 = "select productionWorkNumber from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where advanceInformationSheet_id = '" + List[i].id + "'";
        var advanceInformationSheetDetailList2 = ObjectStore.queryByYonQL(sql2);
        // 获取生产工号
        for (var j = 0; j < advanceInformationSheetDetailList2.length; j++) {
          var SCGH = advanceInformationSheetDetailList2[j].productionWorkNumber;
          if (advanceInformationSheetDetailList != null) {
            for (var h = 0; h < advanceInformationSheetDetailList.length; h++) {
              var productionWorkNumber2 = advanceInformationSheetDetailList[h].productionWorkNumber;
              var flag = SCGH == productionWorkNumber2;
              if (flag) {
                sum = sum + 1;
                throw new Error("此生产工号有还未进行审批的单据,请审批后再进行提交");
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });