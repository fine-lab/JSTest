let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var boolean = true;
    var id = param.data[0].id;
    //查询提交的生产工号
    var sql = "select productionWorkNumber from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where advanceInformationSheet_id = '" + id + "'";
    var List = ObjectStore.queryByYonQL(sql);
    //查询审批中的合同号
    var sql0 = "select  id from GT102917AT3.GT102917AT3.advanceInformationSheet where  verifystate ='1'";
    var List0 = ObjectStore.queryByYonQL(sql0);
    for (var m = 0; m < List0.length; m++) {
      //查询审批中的生产工号
      var sql1 = "select  productionWorkNumber from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where  advanceInformationSheet_id = '" + List0[m].id + "'";
      var List1 = ObjectStore.queryByYonQL(sql1);
      for (var i = 0; i < List.length; i++) {
        for (var j = 0; j < List1.length; j++) {
          if (List[i].productionWorkNumber == List1[j].productionWorkNumber) {
            var str = "生产工号" + List[i].productionWorkNumber + "存在未审批的单据";
            throw new Error(str);
          }
        }
      }
    }
    return { boolean };
  }
}
exports({ entryPoint: MyTrigger });