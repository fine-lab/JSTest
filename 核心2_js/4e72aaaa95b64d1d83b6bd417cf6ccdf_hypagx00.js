let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var yzUrl = "https://www.example.com/";
    var header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var body = {
      body: {
        method: "add"
      }
    };
    //存放多个日结单的数组
    var daycloseBillList = new Array();
    for (var i = 0; i < 25000; i++) {
      var queryResponse = postman("post", yzUrl, JSON.stringify(header), JSON.stringify(body));
      var queryResponseJson = JSON.parse(queryResponse);
      var queryCode = queryResponseJson.code;
      if (queryCode == "200") {
        //查询成功，拼接日结单数据
        let allbody = queryResponseJson.data.res;
        allbody.forEach((body, index) => {
          let bodyData = {
            storecode: body.storecode,
            store: body.store,
            erporgcode: body.erporgcode,
            erporgname: body.erporgname,
            businessdate: body.businessdate,
            dayclosedate: body.dayclosedate,
            salemoney: body.salemoney,
            vipincome: body.vipincome
          };
          //将单个日结单放到集合中
          daycloseBillList.push(bodyData);
        });
      }
      if (daycloseBillList.length == 2) {
        //批量插入日结单,先插入在清空
        try {
          var response = ObjectStore.insertBatch("GT31971AT37.GT31971AT37.yonbuilderTestW", daycloseBillList, "9ff980b0");
        } catch (err) {
          console.error(err);
        }
        daycloseBillList.length = 0;
      }
    }
    return { res: response };
  }
}
exports({ entryPoint: MyAPIHandler });