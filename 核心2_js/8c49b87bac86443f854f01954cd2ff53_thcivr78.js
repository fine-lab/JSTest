let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //删除实体
    var object = {
      DengLuMing: request.loginName
    };
    var res = ObjectStore.deleteByMap("AT175A93621C400009.AT175A93621C400009.rzh90", object, request.companyCode);
    //添加实体
    var object = {
      XingMing: request.name,
      DengLuMing: request.loginName,
      Role: request.role,
      shifubangdingweixin: request.isWeixin,
      WeiXinID: request.wixinId,
      PassWD: request.password,
      Enable_Date: request.enableDate,
      Disable_Date: request.disabl_Date,
      Reg_Date: request.regDate,
      enable: request.enable
    };
    //注册之前查询可用许可量
    var sqlPermit = "select * from AT175A93621C400009.AT175A93621C400009.rzh91";
    var permitSum = ObjectStore.queryByYonQL(sqlPermit);
    var currentLicense = permitSum[0].CurrentLicense; //当前许可
    var warningPermit = permitSum[0].WarningPermit; //预警许可
    var purchasePermit = permitSum[0].PurchasePermit; //购买许可
    if (currentLicense >= purchasePermit) {
      var result = {
        code: 900,
        message: "success",
        data: {}
      };
      return result;
    }
    var res = ObjectStore.insert("AT175A93621C400009.AT175A93621C400009.rzh90", object, request.companyCode);
    //注册完成后查询人员信息表中的数据量并写入许可表中
    var sqlsum = "select count(*) from AT175A93621C400009.AT175A93621C400009.rzh90";
    var sum = ObjectStore.queryByYonQL(sqlsum);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", "1843363877276876809");
    var toUpdate = { CurrentLicense: sum.length };
    var res = ObjectStore.update("AT175A93621C400009.AT175A93621C400009.rzh91", toUpdate, updateWrapper, "rzh91");
    return { status: sum.length, object: object };
  }
}
exports({ entryPoint: MyAPIHandler });