let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    //每天更新开始
    let startdtNow = new Date();
    startdtNow.setTime(startdtNow.getTime() - 1 * 24 * 60 * 60 * 1000); //当天日期减1天，天*小时*分钟*秒*毫秒
    let makeTimeStart = startdtNow.toJSON().substr(0, 10);
    let enddtNow = new Date();
    let makeTimeEnd = enddtNow.toJSON().substr(0, 10);
    //每天更新结束
    let accbookcode = "010001";
    let url = "https://www.example.com/" + makeTimeStart + "&makeTimeEnd=" + makeTimeEnd + "&accbookCode=" + accbookcode;
    let apiResponse = postman("get", url, JSON.stringify(header));
    let data = JSON.parse(apiResponse).data;
    if (data.length <= 0) {
      return { dataMessages: "当前时间无凭证需要同步SAP!" };
    } else {
      let dataJson = JSON.parse(data);
      for (let k = 0; k < dataJson.length; k++) {
        let entityJson = dataJson[k];
        let messagesReturn = entityJson.messages;
        if (messagesReturn.length > 200) {
          var messagesStr = substring(messagesReturn, 0, 180);
          entityJson["messages"] = messagesStr;
        }
        //根据凭证索引号查询是否新增
        var objectSel = { voucherIndex: entityJson.voucherIndex };
        var resSelect = ObjectStore.selectByMap("AT17B45A321DD80004.AT17B45A321DD80004.VoucherNumCodeMaster", objectSel);
        if (resSelect.length == 0) {
          var saveResponse = ObjectStore.insert("AT17B45A321DD80004.AT17B45A321DD80004.VoucherNumCodeMaster", entityJson, "ybd4ca7b6fList");
        } else {
          resSelect[0]["accountName"] = entityJson.accountName;
          resSelect[0]["accountPeriod"] = entityJson.accountPeriod;
          resSelect[0]["makerDate"] = entityJson.makerDate;
          resSelect[0]["voucherNumberYs"] = entityJson.voucherNumberYs;
          resSelect[0]["voucherCodeSap"] = entityJson.voucherCodeSap;
          resSelect[0]["statusLine"] = entityJson.statusLine;
          resSelect[0]["messages"] = entityJson.messages;
          var updateRes = ObjectStore.updateById("AT17B45A321DD80004.AT17B45A321DD80004.VoucherNumCodeMaster", resSelect, "ybd4ca7b6fList");
        }
      }
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });