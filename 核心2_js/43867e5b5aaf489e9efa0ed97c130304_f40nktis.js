let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let config = {
      appcode: "GT8429AT6",
      apiurl: {
        //项目保存
        projectSave: "https://www.example.com/"
      }
    };
    return { config };
  }
}
exports({ entryPoint: MyTrigger });