let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      data: {
        id: "youridHere",
        staffVODefine: {
          define1: "1232344",
          define2: "true",
          id: "youridHere"
        }
      }
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "HRED", JSON.stringify(body));
  }
}
exports({ entryPoint: MyTrigger });