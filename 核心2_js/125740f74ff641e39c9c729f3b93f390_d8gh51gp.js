let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //拿子表作唯一校验
    var requestData = param.requestData;
    var requestDatas = JSON.parse(requestData);
    var status = requestDatas._status;
    if (status == "Insert") {
      var returnSet = param.return;
      var subTable = returnSet.VerificationSubTableList;
      for (var i = 0; i < subTable.length; i++) {
        //子表id
        var sonCode = subTable[i].shebeibianma_shebeibianma_code;
        var sonNumber = subTable[i].shebeibianma;
        var name = subTable[i].shebeibianma_shebeibianma_shebeibianma_code;
        var sql1 = "select * from AT15F164F008080007.AT15F164F008080007.VerificationSubTable where shebeibianma ='" + sonNumber + "'";
        var res1 = ObjectStore.queryByYonQL(sql1, "developplatform");
        if (res1.length > 1) {
          var error = " -- 设备编号为:" + sonCode + ",设备名称为:" + name + ",该设备在当前设备校验表已存在,请勿重复添加 -- ";
          throw new Error(error);
        }
      }
    }
    if (status == "Update") {
      var sbod = "";
      var subTable = requestDatas.VerificationSubTableList;
      for (var i = 0; i < subTable.length; i++) {
        //子表id
        var sonCode = subTable[i].shebeibianma_shebeibianma_code;
        var sonNumber = subTable[i].shebeibianma;
        var name = subTable[i].shebeibianma_shebeibianma_shebeibianma_code;
        var sql1 = "select * from AT15F164F008080007.AT15F164F008080007.VerificationSubTable where shebeibianma ='" + sonNumber + "'";
        var res1 = ObjectStore.queryByYonQL(sql1, "developplatform");
        if (res1.length > 1) {
          var error = " -- 设备编号为:" + sonCode + ",设备名称为:" + name + ",该设备在当前设备校验表已存在,请勿重复添加 -- ";
          throw new Error(error);
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });