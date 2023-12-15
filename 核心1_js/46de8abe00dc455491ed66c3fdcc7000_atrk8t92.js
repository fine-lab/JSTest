let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      roleId: "yourIdHere",
      pageNumber: 1,
      pageSize: 10
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT168255FC17080007", JSON.stringify(body));
    const list = JSON.parse(apiResponse).data.list;
    var receiver = [];
    for (const row of list) {
      receiver.push(row.yhtUserId);
    }
    return { receiver };
  }
}
exports({ entryPoint: MyTrigger });