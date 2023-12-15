let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var value1 = request.def;
    throw new Error(value1);
    let url = "https://www.example.com/";
    var body = {
      items: [{ text: "操你妈", type: "content" }]
    };
    let header = {
      authoration: "apicode",
      apicode: "8c24a791254c4beb9173f98bc066732b",
      "Content-Type": "application/json"
    };
    let result = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    console.log("-----------------------");
    console.log(result);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });