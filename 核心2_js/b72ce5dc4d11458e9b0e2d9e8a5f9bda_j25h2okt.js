let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let isNext = true;
    let nextNum = 1;
    let queryParam = {
      pageIndex: nextNum,
      pageSize: 200,
      simple: {
        "detail.stopstatus": false
      }
    };
    let func1 = extrequire("GT101792AT1.common.getApiToken");
    let res = func1.execute();
    let token = res.access_token;
    let url = "https://www.example.com/" + token;
    var skuList = new Array();
    let header = {
      "Content-Type": "application/json"
    };
    while (isNext) {
      var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(queryParam));
      var responseJson = JSON.parse(strResponse);
      var data = responseJson.data;
      var recordList = data.recordList;
      if (data.endPageIndex <= queryParam.pageIndex) {
        isNext = false;
      } else {
        queryParam.pageIndex = queryParam.pageIndex + 1;
      }
      if (recordList.length > 0) {
        for (let i = 0; i < recordList.length; i++) {
          let record = recordList[i];
          if (record.pc_productlist_userDefine007 != undefined && record.pc_productlist_userDefine007 != record.code) {
            skuList.push(record);
          }
        }
      }
    }
    return { skuList };
  }
}
exports({ entryPoint: MyTrigger });