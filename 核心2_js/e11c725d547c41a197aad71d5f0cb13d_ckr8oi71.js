let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var allData = param.data;
    if (allData.length != 0) {
      var value = allData[0];
    }
    //需要删除id
    var zid = value.id; //
    var updSql = "select * from	AT17604A341D580008.AT17604A341D580008.sharingEntity where id = '" + zid + "' and dr=0";
    var updRes = ObjectStore.queryByYonQL(updSql, "developplatform");
    if (updRes.length != 0) {
      var numbVersion = updRes[0].srcBillVersion;
    }
    if (numbVersion != null || numbVersion != undefined) {
      var code = "AT17604A341D580008.AT17604A341D580008.sharingEntity";
      let url = "https://www.example.com/" + code;
      let body = { srcBusiId: zid, srcBillVersion: numbVersion };
      let apiResponse = openLinker("POST", url, "AT17604A341D580008", JSON.stringify(body));
      var JSONAll = JSON.parse(apiResponse);
      if (JSONAll.code === "200") {
        return { apiResponse };
      } else {
        throw new Error("错误原因:" + apiResponse.message);
      }
    }
  }
}
exports({ entryPoint: MyTrigger });