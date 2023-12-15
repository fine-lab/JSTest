let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let currentUser = JSON.parse(AppContext()).currentUser;
    let staffId = currentUser.staffId;
    let billNo = request.billNo; //ruleName,billNo,isList
    let sqlStr =
      "select *,(select * from LimitPersonList) as LimitPersonList,(select fieldName,isMain,childrenField,isVisilble,fieldLabel from FieldParamsList) as FieldParamsList  " +
      " from  GT3734AT5.GT3734AT5.FieldLimit inner join GT3734AT5.GT3734AT5.LimitPerson B on B.FieldLimit_id=id" +
      " where isEnabled=1 and billNo='" +
      billNo +
      "' and B.person='" +
      staffId +
      "'";
    sqlStr =
      "select *,(select fieldName,isMain,childrenField,isVisilble,fieldLabel from FieldParamsList) as FieldParamsList  " +
      " from  GT3734AT5.GT3734AT5.FieldLimit " +
      " where isEnabled=1 and billNo='" +
      billNo +
      "' and  id in(select FieldLimit_id from GT3734AT5.GT3734AT5.LimitPerson  where person='" +
      staffId +
      "')";
    var data = ObjectStore.queryByYonQL(sqlStr); //,'developplatform'
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });