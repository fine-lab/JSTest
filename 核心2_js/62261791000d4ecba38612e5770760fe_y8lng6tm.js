let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month > 9 ? month : "0" + month;
    day = day < 10 ? "0" + day : day;
    var today = year + "-" + month + "-" + day;
    var costId = ""; // 获取当前租户费用项目的id
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {
      fields: "name,id",
      startTs: "2022-11-01",
      endTs: today
    };
    let rawData = openLinker("post", url, "AT1643E3AC08680006", JSON.stringify(body));
    var jsonObj = JSON.parse(rawData);
    var wantData = jsonObj.data;
    for (let i in wantData) {
      if (wantData[i].name == "押金1") {
        costId = JSON.stringify(wantData[i].id);
      }
    }
    throw new Error(costId);
    return {};
  }
}
exports({ entryPoint: MyTrigger });