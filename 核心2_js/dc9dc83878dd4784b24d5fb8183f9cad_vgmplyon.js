let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = request.params;
    var res = ObjectStore.insert("GT43680AT4.GT43680AT4.luli_settlement", object, "997bd7fb");
    var source_settle_poundList = request.params.luli_settle_poundList;
    // 修改原有磅单
    for (var i = 0; i < source_settle_poundList.length; i++) {
      var luli_settle_pound = source_settle_poundList[i];
      luli_settle_pound.is_settlement = "1";
      luli_settle_pound.statement_code = res.code;
      var luli_settle_levelList = luli_settle_pound.luli_settle_levelList;
      luli_settle_pound.luli_level_judge = luli_settle_levelList;
      luli_settle_pound.subTable = luli_settle_levelList;
      var sub = ObjectStore.updateById("GT43680AT4.GT43680AT4.luli_pound_data", luli_settle_pound, "f9abc877");
      var luli_settle_levelList = luli_settle_pound.luli_settle_levelList;
      if (luli_settle_levelList) {
        for (var j = 0; j < luli_settle_levelList.length; j++) {
          var luli_settle_level = luli_settle_levelList[j];
          if (luli_settle_level) {
            var ens = ObjectStore.updateById("GT43680AT4.GT43680AT4.luli_level_judge", luli_settle_level, "f9abc877");
          }
        }
      }
    }
    return { ret: res };
  }
}
exports({ entryPoint: MyAPIHandler });