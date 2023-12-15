let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let currentUser = JSON.parse(AppContext()).currentUser;
    let staffId = currentUser.staffId;
    let billNo = request.billNo; //ruleName,billNo,isList
    let sqlStr =
      "select *,(select fieldName,isMain,childrenField,isVisilble,fieldLabel from FieldParamsList) as FieldParamsList  " +
      " from  GT3734AT5.GT3734AT5.FieldLimit " +
      " where isEnabled=1 and  id in(select FieldLimit_id from GT3734AT5.GT3734AT5.LimitPerson)";
    console.log(sqlStr);
    var data = ObjectStore.queryByYonQL(sqlStr); //,'developplatform'
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });