let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var responseObj = postman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    var res = JSON.parse(responseObj);
    var object = res.CUS_TRANSAC;
    for (var i = 0; i < object.length; i++) {
      object[i]["customs_archives_type"] = "CUS_TRANSAC";
    }
    var res = ObjectStore.insertBatch("AT172DC53E1D280006.AT172DC53E1D280006.customs_archives1", object, "customs_archives1");
    return { responseObj };
  }
}
exports({ entryPoint: MyTrigger });