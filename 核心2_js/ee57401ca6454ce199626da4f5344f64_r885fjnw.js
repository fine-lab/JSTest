let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "http://10.10.200.54/uapws/riaorg/orgmanage/org/queryOrgByCode";
    let body = {
      code: ["ZHGL"],
      version: "1"
    }; //请求参数
    let apiResponse = openLinker("POST", url, "AT164E137409380003", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    console.log("77777777777777777777777777777");
  }
}
exports({ entryPoint: MyTrigger });