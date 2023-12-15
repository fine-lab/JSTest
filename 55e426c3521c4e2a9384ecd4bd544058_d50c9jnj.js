let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.billId;
    //查询内容
    let searchSQL =
      "select *,bustype.name,org_id.name,org_id.code,(select *,pk_material.code,pk_material.model  from espoplandetailsList) espoplandetailsList from GT37522AT1.GT37522AT1.espoplan where id='" +
      id +
      "'";
    var res = ObjectStore.queryByYonQL(searchSQL);
    if (res && res.length > 0) {
      return { aggvo: res[0] };
    } else {
      return {};
    }
  }
}
exports({ entryPoint: MyAPIHandler });