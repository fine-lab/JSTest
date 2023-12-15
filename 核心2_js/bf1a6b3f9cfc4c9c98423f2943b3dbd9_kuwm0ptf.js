let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取请求的参数
    var openid = request.openid === undefined || request.openid === null || request.openid === "" ? null : request.openid;
    var phone_num = request.phone_num === undefined || request.phone_num === null || request.phone_num === "" ? null : request.phone_num;
    var nickname = request.nickname === undefined || request.nickname === null || request.nickname === "" ? null : request.nickname;
    var cs_gender = request.gender === undefined || request.gender === null || request.gender === "" ? null : request.gender;
    var province = request.province === undefined || request.province === null || request.province === "" ? null : request.province;
    var city = request.city === undefined || request.city === null || request.city === "" ? null : request.city;
    var country = request.country === undefined || request.country === null || request.country === "" ? null : request.country;
    if (openid === null) {
      throw new Error("openid 不允许为空！");
    }
    //查询数据库用户是否存在
    var query_user_sql = "select openid,phone_num from GT6990AT161.GT6990AT161.cs_app_user_doc where openid ='" + openid + "'";
    var app_user = ObjectStore.queryByYonQL(query_user_sql);
    if (app_user.length > 0) {
      return { result: "该用户已存在，无需再次添加" };
    }
    //添加用户
    var app_user_obj = { openid: openid, phone_num: phone_num, nickname: nickname, cs_gender: cs_gender, province: province, city: city, country: country };
    var res = ObjectStore.insert("GT6990AT161.GT6990AT161.cs_app_user_doc", app_user_obj, "060cfe0c");
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });