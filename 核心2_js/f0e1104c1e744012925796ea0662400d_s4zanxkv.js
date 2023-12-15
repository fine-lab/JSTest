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
      let code = "999";
      let orderCode, attrext7, recieveDate, attrext6_name, subQty, status, warehouse;
      let foundMatch = false;
      let filteredData = [];
      let innerArrayList = [];
      data.forEach((item) => {
        let itemAttrext7 = item.arrivalPlanDefineCharacter ? item.arrivalPlanDefineCharacter.attrext7 : "";
        let attrext6_name = item.arrivalPlanDefineCharacter ? item.arrivalPlanDefineCharacter.attrext6_name : "";
        if (item.orderCode === request.code && item.status == request.status && itemAttrext7 === request.carcode) {
          orderCode = item.orderCode;
          attrext7 = itemAttrext7;
          recieveDate = item.recieveDate;
          attrext6_name = attrext6_name;
          subQty = item.subQty;
          status = item.status;
          warehouse = item.warehouse;
          innerArrayList.push({
            orderCode: orderCode,
            attrext7: attrext7,
            recieveDate: recieveDate,
            attrext6_name: attrext6_name,
            subQty: subQty,
            warehouse: warehouse,
            status: status
          });
          foundMatch = true;
        }
      });
      filteredData.push(...innerArrayList); // 将内部数组添加到结果数组中
      if (foundMatch) {
        return { filteredData };
      } else {
        return { code: 999, errormsg: "找不到符合条件的记录,请检查传的值是否正确" };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });