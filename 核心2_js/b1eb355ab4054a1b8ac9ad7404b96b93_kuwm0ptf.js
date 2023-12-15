let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    var urlNow = ObjectStore.env().url;
    try {
      let url = urlNow + "/iuap-api-gateway/yonbip/fi/ficloud/api/querySubjectBalance";
      let body = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        codes: context.codes, //会计科目 数组结构
        period1: context.period1, //起始期间,必填
        period2: context.period2, //结束期间,必填
        currency: "",
        tally: 0,
        tempvoucher: 0
      };
      let apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var res1 = JSON.parse(apiResponse);
      // 上期值
      let funcPreviousPeriodDate = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      var lastMonth = funcPreviousPeriodDate.execute(context.period2).date;
      // 上期最大子科目参数
      let lastMonthBody = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        codes: [], //会计科目 数组结构
        period1: lastMonth, //起始期间,必填
        period2: lastMonth, //结束期间,必填
        currency: "",
        tally: 0,
        tempvoucher: 0
      };
      var subjectCodes = context.codes;
      var response = {};
      var test = [];
      // 	对接口返回编码进行判断 0失败  200正常返回
      let code = res1.code;
      if (code == 0) {
        return res1.message;
      } else {
        let datas = res1.data;
        subjectCodes.forEach((item) => {
          // 定义返回的科目编码，借方贷方金额，最大子科目的借方贷方金额，子科目的编码名称
          let responseSubject;
          let subjectCredit = 0;
          let subjectDebit = 0;
          let detailCredit = 0;
          let detailDebit = 0;
          let detailCode;
          let detailName;
          let responseSubjectDetails = [];
          if (datas != null) {
            datas.forEach((element) => {
              //获取入参科目信息
              if (item == element.accsubject_code) {
                responseSubject = element;
                if (element.hasOwnProperty("localdebit2") && element.localdebit2 != null && element.localdebit2 > subjectDebit) {
                  subjectDebit = element.localdebit2;
                }
                if (element.hasOwnProperty("localcredebit2") && element.localcredebit2 != null && element.localcredebit2 > subjectCredit) {
                  subjectCredit = element.localcredebit2;
                }
              }
              // 获取入参科目的子科目信息 借贷金额 编码和名称
              if (item != element.accsubject_code && element.accsubject_code.includes(item)) {
                responseSubjectDetails.push(element);
                if (element.hasOwnProperty("localdebit2") && element.localdebit2 != null && element.localdebit2 > detailDebit) {
                  detailDebit = element.localdebit2;
                  detailCode = element.accsubject_code;
                  detailName = element.accsubject_name;
                }
                if (element.hasOwnProperty("localcredebit2") && element.localcredebit2 != null && element.localcredebit2 > detailCredit) {
                  detailCredit = element.localcredebit2;
                  detailCode = element.accsubject_code;
                  detailName = element.accsubject_name;
                }
              }
            });
          }
          //获取上期子科目的借贷金额信息并且计算环比
          lastMonthBody.codes = [detailCode];
          let funcPreviousPeriod = extrequire("AT17AF88F609C00004.common.getSubjects");
          let reslast = funcPreviousPeriod.execute(lastMonthBody);
          // 上期子科目借贷金额
          let detailCreditLast;
          let detailDebitLast;
          // 子科目环比
          let detailCreditRate;
          let detailDebitRate;
          // 子科目占主科目的比例
          let detailwithsubjectCreditRate = 0;
          let detailwithsubjectDebitRate = 0;
          if (reslast.hasOwnProperty("localdebit2") && reslast.localdebit2 != null) {
            detailDebitLast = reslast.localdebit2;
          }
          if (reslast.hasOwnProperty("localcredebit2") && reslast.localcredebit2 != null) {
            detailCreditLast = reslast.localcredebit2;
          }
          if (detailCreditLast != null && detailCreditLast != 0) {
            detailCreditRate = MoneyFormatReturnBd((detailCredit - detailCreditLast) / detailCreditLast, 2);
          }
          if (detailDebitLast != null && detailDebitLast != 0) {
            detailDebitRate = MoneyFormatReturnBd((detailDebit - detailDebitLast) / detailDebitLast, 2);
          }
          if (subjectCredit != 0 && detailCredit != 0) {
            detailwithsubjectCreditRate = MoneyFormatReturnBd(detailCredit / subjectCredit, 2);
          }
          if (subjectDebit != 0 && detailDebit != 0) {
            detailwithsubjectDebitRate = MoneyFormatReturnBd(detailDebit / subjectDebit, 2);
          }
          response[item] = {
            subjectCode: item,
            subjectName: responseSubject.accsubject_name,
            subjectCredit: subjectCredit,
            subjectDebit: subjectDebit,
            detailCredit: detailCredit,
            detailDebit: detailDebit,
            detailCode: detailCode,
            detailName: detailName,
            detailCreditLast: detailCreditLast,
            detailDebitLast: detailDebitLast,
            detailCreditRate: detailCreditRate,
            detailDebitRate: detailDebitRate,
            detailwithsubjectCreditRate: detailwithsubjectCreditRate,
            detailwithsubjectDebitRate: detailwithsubjectDebitRate
          };
        });
        return response;
      }
    } catch (e) {
      throw new Error("执行脚本getSubjectsAll报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });