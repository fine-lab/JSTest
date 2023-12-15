let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    let sql = "select define1 from aa.merchant.MerchantDefine where id = 2185044190269952";
    let res1 = ObjectStore.queryByYonQL(sql, "productcenter");
    var define2 = res1[0].define1;
    if (define2 == "true") {
    } else {
      var object = { data: { memo: "11", khdzqrdh2List: [{ money: "111" }] } };
      var base_path = "https://www.example.com/";
      //拿到access_token
      let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
      let res2 = func.execute("");
      var token = res2.access_token;
      var hmd_contenttype = "application/json;charset=UTF-8";
      let header = { "Content-Type": hmd_contenttype };
      let apiResponse = postman("post", base_path + "?access_token=" + token, JSON.stringify(header), JSON.stringify(object));
      var obj = JSON.parse(apiResponse);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });