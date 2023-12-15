let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let getToken = extrequire("AT161E5DFA09D00001.apiFunction.getToken");
    let getTokenResult = getToken.execute();
    let access_token = getTokenResult.access_token;
    let url = "https://www.example.com/" + access_token;
    let WarehousingAcceptanceSheetList = request.WarehousingAcceptanceSheetList;
    WarehousingAcceptanceSheetList.forEach((WarehousingAcceptanceSheet) => {
      let mailReceiver = [];
      let the_client_code = WarehousingAcceptanceSheet.the_client_code;
      let AdvanceArrivalNoticeNo = WarehousingAcceptanceSheet.AdvanceArrivalNoticeNo;
      let Customer_informationList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Customer_information", { clientcode: the_client_code });
      Customer_informationList.forEach((Customer_information) => {
        let body = {
          condition: {
            simpleVOs: [
              {
                field: "userName",
                op: "eq",
                value1: Customer_information.user_name
              }
            ]
          },
          page: {
            pageIndex: 1,
            pageSize: 100
          }
        };
        let header = {};
        let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
        let Response = JSON.parse(strResponse);
        let recordList = Response.data.recordList;
        recordList.forEach((record) => {
          mailReceiver.push(record.email);
        });
      });
      let subject = "【提醒】入库验收单（ASN：" + AdvanceArrivalNoticeNo + "）已确认";
      let content = "您好：<br>入库验收单（ASN：" + AdvanceArrivalNoticeNo + "）已确认，请即时录入【产品入库验收数据子集】。";
      let sendMailPublic = extrequire("AT161E5DFA09D00001.apiFunction.sendMailPublic");
      let sendMailPublicResult = sendMailPublic.execute({ mailReceiver: mailReceiver, subject: subject, content: content });
    });
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });