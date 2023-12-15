let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pageIndex = 1;
    let creatorParam = { pageIndex: pageIndex, pageSize: "300" };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("GET", url, "AT1992457609780002", JSON.stringify(creatorParam));
    let creatordata = JSON.parse(apiResponse);
    if (creatordata.code != null && creatordata.code == "200" && creatordata.message == "操作成功") {
      let data = creatordata.data;
      let orderCode, attrext7;
      let foundMatch = false;
      data.forEach((item) => {
        let itemAttrext7 = item.arrivalPlanDefineCharacter ? item.arrivalPlanDefineCharacter.attrext7 : "";
        if (item.orderCode === request.code || itemAttrext7 === request.carcode) {
          orderCode = item.orderCode;
          attrext7 = itemAttrext7;
          foundMatch = true;
        }
      });
      if (foundMatch) {
        return { orderCode, attrext7 };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });