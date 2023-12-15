let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取页面上的数据
    var model = request.model;
    //获取到主表id
    var Id = model.id;
    // 根据主表id获取子表所有信息
    var sql = "select * from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where advanceInformationSheet_id='" + Id + "'";
    var res = ObjectStore.queryByYonQL(sql);
    // 获取主表合同号
    var sql1 = "select contractNumber from GT102917AT3.GT102917AT3.advanceInformationSheet where id = '" + Id + "'";
    var TT = ObjectStore.queryByYonQL(sql1);
    var array = new Array();
    var state = model.billState;
    if (state == 2) {
      // 遍历子表集合
      for (var i = 0; i < res.length; i++) {
        // 计算本次预支金额
        var s4 = res[i].amountOfAdvanceThisTime * -1;
        var s1 = res[i].installationGroupAmount * -1;
        var s2 = res[i].amountAvailableInAdvance * -1;
        var qq = {
          productionWorkNumber: res[i].productionWorkNumber,
          type: res[i].type,
          tier: res[i].tier,
          stand: res[i].stand,
          door: res[i].door,
          remark: res[i].remark,
          dr: res[i].dr,
          installationGroupAmount: res[i].installationGroupAmount,
          amountAvailableInAdvance: res[i].amountAvailableInAdvance,
          amountAdvanced: res[i].amountAdvanced,
          installationGroupAmount: s1,
          amountAvailableInAdvance: s2,
          amountOfAdvanceThisTime: s4,
          tenant_id: res[i].tenant_id,
          supervisoryStaff: res[i].supervisoryStaff,
          branch: res[i].branch
        };
        var list = qq;
        array.push(list);
      }
      var object = {
        contractNumber: TT[0].contractNumber,
        entrustingParty: model.entrustingParty,
        advanceType: model.advanceType,
        advanceDate: model.advanceDate,
        amountInTotal: -model.amountInTotal,
        schedule: model.schedule,
        remark: model.remark,
        billState: "1",
        dr: model.dr,
        tenant_id: model.tenant_id,
        branch: model.branch,
        supervisoryStaff: model.supervisoryStaff,
        _id: model._id,
        advanceInformationSheetDetailList: array
      };
      // 更新实体，并且插入实体
      var qwe = ObjectStore.insert("GT102917AT3.GT102917AT3.advanceInformationSheet", object, "1e3ef2af");
      var asd = TT[0].contractNumber;
      var object1 = { id: Id, billState: "1" };
      var res1 = ObjectStore.updateById("GT102917AT3.GT102917AT3.advanceInformationSheet", object1, "1e3ef2af");
    }
    return { res1 };
  }
}
exports({ entryPoint: MyAPIHandler });