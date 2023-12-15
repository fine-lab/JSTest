let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = JSON.parse(param.requestData);
    let org_id = requestData.org_id;
    if (requestData.stopNum >= 3) {
      throw new Error("频繁操作，请联系管理员！");
    }
    if (org_id == undefined) {
      //创建可管理组织时，业务单元ID没有回写成功
      throw new Error("没有组织单元ID，停用失败！请联系管理员检查");
    }
    let request = {};
    request.uri = "/yonbip/digitalModel/orgunit/stop";
    request.body = { data: { id: org_id, enable: 2 } };
    let Orgfunc = extrequire("GT34544AT7.common.baseOpenApi");
    let Orgfuncres = Orgfunc.execute(request).res;
    //停用成功后，将订购组织账簿数+被授权账簿数，用户数+被授权用户数
    if (Orgfuncres.code == "200" && Orgfuncres.data.enable == 2 && requestData.enable == 1) {
      let OrderOrgCode = requestData.OrderOrgCode; //订购组织编码
      let GxyServiceCode = requestData.GxyServiceCode; //服务编码
      let selectIDsql =
        "select id,UsedUserquantity,UsedOrgquantity from GT3AT33.GT3AT33.test_OrderService where OrgCode = '" + OrderOrgCode + "' and GxyServiceCode = '" + GxyServiceCode + "' and dr = 0";
      let OrderServiceIdArr = ObjectStore.queryByYonQL(selectIDsql);
      let OrderServiceId = OrderServiceIdArr[0].id; //‘订购服务项目’表ID
      let UsedOrgquantity = OrderServiceIdArr[0].UsedOrgquantity; //已授权账簿数量
      if (OrderServiceId == undefined || OrderServiceId == null) {
        //没有查询到‘订购服务项目’表ID，给出警告
        throw new Error("停用操作中更新订购组织可授权数量时，未查询到订购服务的记录！请联系管理员检查");
      }
      let useOrg = UsedOrgquantity - 1; //停用账簿组织后，除了收回已授权的组织数量还要收回刚刚停用的账簿组织数量（1）
      if (useOrg >= 0) {
        var object = [{ id: OrderServiceId, UsedOrgquantity: useOrg, stopNum: requestData.stopNum + 1 }];
        var res = ObjectStore.updateBatch("GT3AT33.GT3AT33.test_OrderService", object, "3677f4d7");
      } else {
        throw new Error("已授权数量-待增加数量为负数，请联系管理员检查");
      }
    } else if (requestData.enable !== 1) {
      throw new Error("当前状态已非启用状态！");
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });