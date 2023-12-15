let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    var urlNow = ObjectStore.env().url;
    var ccodes = context.codes;
    try {
      let url = urlNow + "/iuap-api-gateway/yonbip/fi/ficloud/api/querySubjectBalance";
      let body = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        codes: ccodes, //会计科目 数组结构
        period1: context.period1, //起始期间,必填
        period2: context.period2, //结束期间,必填
        currency: "",
        tally: 0,
        tempvoucher: 0
      };
      let apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var res1 = JSON.parse(apiResponse);
      // 	对接口返回编码进行判断 0失败  200正常返回
      let code = res1.code;
      if (code == 0) {
        return res1.message;
      } else {
        let datas = res1.data;
        var response = [];
        if (datas != null) {
          datas.forEach((element) => {
            //只获取在入参中需要的数据，不获取模糊出来的数据
            if (ccodes.includes(element.accsubject_code)) {
              response.push(element);
            }
          });
        }
        return response;
      }
    } catch (e) {
      throw new Error("执行脚本getSubjects报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });