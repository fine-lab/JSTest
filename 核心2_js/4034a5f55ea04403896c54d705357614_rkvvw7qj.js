let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pdata = request.data;
    let sql1 = "select id from voucher.order.Order where code = " + pdata.orderNo;
    let res1 = ObjectStore.queryByYonQL(sql1, "udinghuo");
    //传参
    var sdata = {};
    sdata.data = pdata;
    var resdata = JSON.stringify(pdata);
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res = func.execute("");
    var token2 = res.access_token;
    let apiResponse = postman("get", base_path.concat("?access_token=3bf4b35281214c84a0817a096bcfc087&id=" + res1.id), JSON.stringify(header)); //测试时写死测试环境的token
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code != "200") {
      throw new Error("同步失败!" + obj.message);
    } else {
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });