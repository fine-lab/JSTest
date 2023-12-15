let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let stockId = data.id;
    // 定义检验单ID
    let checkBillId;
    // 获取出库单CODE
    let stockCode = data.code;
    // 检验单不存在，查询检验单ID
    if (!checkBillId) {
      let sqlstr = "select id from GT52668AT9.GT52668AT9.checkOrder where othoutrecordcode =" + stockCode;
      let temp = ObjectStore.queryByYonQL(sqlstr, "developplatform");
      if (temp && temp.length > 0) {
        checkBillId = temp[0].id + "";
      }
    }
    if (checkBillId) {
      // 定义要更新的对象
      var object = { id: checkBillId, othoutrecordcode: "--" };
      let functoken = extrequire("ustock.backDefaultGroup.getOpenApiToken");
      let res = functoken.execute();
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
      let ccc = obj;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });