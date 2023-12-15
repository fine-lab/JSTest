let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let stockId = data.id;
    //这个是检验单id
    let id;
    let code = data.code;
    if (!id) {
      let sql = "select id from GT52668AT9.GT52668AT9.checkOrder where stockstatuschangecode =" + code;
      let temp = ObjectStore.queryByYonQL(sql, "developplatform");
      if (temp && temp.length > 0) {
        id = temp[0].id + "";
      }
    }
    var stockstatuschangecode = " ";
    var object = { id: id, stockstatuschangecode: " " };
    if (id) {
      let func1 = extrequire("ustock.backDefaultGroup.getOpenApiToken");
      let res = func1.execute();
      var hmd_contenttype = "application/json;charset=UTF-8";
      let header = {
        "Content-Type": hmd_contenttype
      };
      var token = res.access_token;
      let base_path = "https://www.example.com/";
      // 请求数据
      var str = JSON.stringify(object);
      let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), str);
      var obj = JSON.parse(apiResponse);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });