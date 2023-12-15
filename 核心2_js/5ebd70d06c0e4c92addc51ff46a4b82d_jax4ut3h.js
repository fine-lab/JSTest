let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let serialNumber = context.serialNumber;
    let url = "https://www.example.com/" + context.billNo;
    let apiResponse = openLinker("GET", url, "AT1672920C08100005", JSON.stringify({}));
    let res = JSON.parse(apiResponse);
    if (res.code == "200") {
      let id = res.data.id;
      return { id };
    } else {
      throw new Error("流水号:" + serialNumber + ",没有查到个人借款单id");
    }
  }
}
exports({ entryPoint: MyTrigger });