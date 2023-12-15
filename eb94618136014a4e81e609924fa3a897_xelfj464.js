let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    let model = JSON.parse(responseObj);
    var object = { name: model.msg };
    var res = ObjectStore.insert("AT17F67B7416200009.AT17F67B7416200009.table_field_chyd", object, "table_field_chydList");
    return { res };
  }
}
exports({ entryPoint: MyTrigger });