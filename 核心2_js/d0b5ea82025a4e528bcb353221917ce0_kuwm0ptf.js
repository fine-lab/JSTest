let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询微信小程序用户
    var openid = request.openid;
    var querySql =
      "select def1 as username,def2 as company,enable,openid,phone_num,country,province,city,name,nickname,cs_gender as gender,ic_sex,ic_birth,ic_ethnicity,ic_address,ic_number,ic_issue,ic_valid_from,ic_valid_to from GT6990AT161.GT6990AT161.cs_app_user_doc where 1=1 ";
    if (openid !== null && openid !== undefined && openid !== "") {
      querySql += " and openid = '" + openid + "'";
    }
    var res = ObjectStore.queryByYonQL(querySql);
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });