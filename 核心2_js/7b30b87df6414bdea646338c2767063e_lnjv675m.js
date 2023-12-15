let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = JSON.parse(param.requestData);
    let org_id = requestData.org_id;
    let request = {};
    request.uri = "/yonbip/digitalModel/orgunit/unstop";
    request.body = { data: { id: org_id, enable: 1 } };
    let Orgfunc = extrequire("GT34544AT7.common.baseOpenApi");
    let Orgfuncres = Orgfunc.execute(request).res;
    if (Orgfuncres.code == "200" && Orgfuncres.data.enable == 1 && requestData.enable == 0) {
      let OrderOrgCode = requestData.OrderOrgCode; //订购组织编码
      let GxyServiceCode = requestData.GxyServiceCode; //服务编码
      let selectIDsql =
        "select id,UsedUserquantity,UsedOrgquantity,Userquantity,Orgquantity from GT3AT33.GT3AT33.test_OrderService where OrgCode = '" +
        OrderOrgCode +
        "' and GxyServiceCode = '" +
        GxyServiceCode +
        "' and dr = 0";
      let OrderServiceIdArr = ObjectStore.queryByYonQL(selectIDsql);
      let OrderServiceId = OrderServiceIdArr[0].id; //‘订购服务项目’表ID
      let UsedOrgquantity = OrderServiceIdArr[0].UsedOrgquantity; //已授权账簿数量
      let Userquantity1 = OrderServiceIdArr[0].Userquantity; //购买的用户数量
      let Orgquantity1 = OrderServiceIdArr[0].Orgquantity; //购买的账簿数量
      if (OrderServiceId == undefined || OrderServiceId == null) {
        //没有查询到‘订购服务项目’表ID，给出警告
        throw new Error("启用操作中更新订购组织可授权数量时，未查询到订购服务的记录！请联系管理员检查");
      }
      let useOrg = UsedOrgquantity + 1; //启用账簿组织后，除了-已授权的组织数量还要-刚刚启用的账簿组织数量（1）
      if (useOrg <= Orgquantity1) {
        var object = [{ id: OrderServiceId, UsedOrgquantity: useOrg }];
        var res = ObjectStore.updateBatch("GT3AT33.GT3AT33.test_OrderService", object, "3677f4d7");
      } else {
        throw new Error("已授权数量+待增加数量超过购买的数量，启用失败！");
      }
    } else if (requestData.enable !== 0) {
      throw new Error("当前状态非停用状态，请勿再次启用！");
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });