let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //删除实体
    var object = {
      DengLuMing: request.loginName
    };
    var res = ObjectStore.deleteByMap("GT37846AT3.GT37846AT3.RZH_901", object, request.companyCode);
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
      Reg_Date: request.regDate
    };
    //注册之前查询可用许可量
    var sqlPermit = "select * from GT37846AT3.GT37846AT3.RZH_902";
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
    var res = ObjectStore.insert("GT37846AT3.GT37846AT3.RZH_901", object, request.companyCode);
    //注册完成后查询人员信息表中的数据量并写入许可表中
    var sqlsum = "select count(*) from GT37846AT3.GT37846AT3.RZH_901";
    var sum = ObjectStore.queryByYonQL(sqlsum);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", "1685299168341393412");
    var toUpdate = { CurrentLicense: sum.length };
    var res = ObjectStore.update("GT37846AT3.GT37846AT3.RZH_902", toUpdate, updateWrapper, "yb578f578c");
    return { status: sum.length };
  }
}
exports({ entryPoint: MyAPIHandler });