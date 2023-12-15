let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      appCode: "albionPos",
      identifyKey: "yourKeyHere",
      identifyValue: "18229425119",
      membershipSystemId: 1,
      partnerId: 1
    };
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      thirdToken: "yourTokenHere"
    };
    let url = "https://www.example.com/";
    console.log(url);
    let infoString = postman("put", url, JSON.stringify(header), JSON.stringify(body));
    console.log(infoString);
    let infoObject = JSON.parse(infoString);
    return { infoObject };
  }
}
exports({ entryPoint: MyTrigger });