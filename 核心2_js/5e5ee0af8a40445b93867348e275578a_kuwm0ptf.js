let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //请求参数
    var openid = request.openid;
    var imageBase64 = request.image;
    // 检验是否实名认证
    var query_sql = "select id,ic_number from GT6990AT161.GT6990AT161.cs_app_user_doc where openid = '" + openid + "'";
    var query_res = ObjectStore.queryByYonQL(query_sql);
    if (query_res.length < 1) {
      throw new Error("用户不存在！");
    }
    if (query_res[0].ic_number != null) {
      throw new Error("用户已实名认证！证件号：" + query_res[0].ic_number.slice(0, 3) + "***********" + query_res[0].ic_number.slice(14));
    }
    // 调实名认证接口
    const apicode = "bbdfaf800d844c7aae619f964de905bd";
    const requestType = "post";
    const requestUrl = "https://www.example.com/";
    const headers = {
      apicode: apicode,
      authoration: "apicode"
    };
    const body = {
      image: imageBase64,
      side: "front"
    };
    var apiResponse = postman(requestType, requestUrl, JSON.stringify(headers), JSON.stringify(body));
    var idcardOcrV2_res = JSON.parse(apiResponse);
    //如果失败
    if (idcardOcrV2_res.code != "200") {
      throw new Error(idcardOcrV2_res);
    } else {
      if (idcardOcrV2_res.data.error_code != null) {
        throw new Error(JSON.stringify(idcardOcrV2_res));
      }
      // 更新微信用户信息
      var { name, sex, birth, ethnicity, address, number } = idcardOcrV2_res.data;
      if (number == null) {
        throw new Error("实名认证失败！");
      }
      var userObj = { id: query_res[0].id, name: name, ic_sex: sex, ic_birth: birth, ic_ethnicity: ethnicity, ic_address: address, ic_number: number };
      var update_res = ObjectStore.updateById("GT6990AT161.GT6990AT161.cs_app_user_doc", userObj);
      return { result: update_res };
    }
  }
}
exports({ entryPoint: MyAPIHandler });