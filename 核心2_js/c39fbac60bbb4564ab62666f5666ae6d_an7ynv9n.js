let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //销售组织
    let salesorgId = request.salesorgId;
    //子表数据
    let oorderDetails = request.oorderDetails;
    let msg = "校验失败";
    throw new Error(JSON.stringify(salesOrgId));
    if (orderdata != undefined && orderdata != "" && oOrderDetails != undefined) {
      //查询费用规则比例
      var res = ObjectStore.queryByYonQL(
        'select * from GT80750AT4.GT80750AT4.material_return where ruleEnable = 1 and beginTime <= "' +
          now.formattedDate +
          '" and endTime >= "' +
          now.formattedDate +
          '"  and useOrg = "' +
          salesOrgId +
          '"'
      );
      //判断是否符合返利比例
      //更新物返金额和数量
      let items = orderdata.item;
      let i = 0;
      var object = [];
      for (var it of items) {
        object[i] = [{ id: self.id, wine_body_id_new: productClassData[0].id, wine_body_id_new_refname: productClassData[0].name }];
        i++;
      }
      //更新
      var res = ObjectStore.updateBatch("GT80750AT4.GT80750AT4.material_return", object);
    } else {
      throw new Error("参数为空");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });