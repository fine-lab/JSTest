let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //调用OA接口，获取token
    let url = "http://218.4.202.238:8999/seeyon/rest/token/NC-YB/85445cd3-77ed-4048-8263-f12ec53403b2?loginName=oa";
    let body = {};
    let apiResponse = openLinker("get", url, "AT168516D809980006", JSON.stringify(body));
    let res = "";
    if (apiResponse != null) {
      res = JSON.parse(apiResponse).id;
      //赋值参数
      let dataValue1 = request.dataValue.applicant_name;
      let dataValue2 = request.dataValue.approvalstatus;
      var getstatus = "";
      if (dataValue2 == "1") {
        getstatus = "未审批";
      } else if (dataValue2 == "2") {
        getstatus = "审批中";
      } else if (dataValue2 == "3") {
        getstatus = "审批通过";
      } else if (dataValue2 == "4") {
        getstatus = "审批失败";
      }
      let dataValue3 = request.dataValue.collectionunit;
      let dataValue4 = request.dataValue.completiondate;
      let dataValue5 = request.dataValue.department;
      let dataValue6 = request.dataValue.paymentamount;
      let dataValue7 = request.dataValue.moen;
      let dataValue8 = request.dataValue.orderamount;
      let dataValue9 = request.dataValue.paymenttype;
      var gettype = "";
      if (dataValue9 == "1") {
        gettype = "合同用款";
      } else if (dataValue9 == "2") {
        gettype = "发票";
      }
      let dataValue10 = request.dataValue.paymentproportion;
      let dataValue11 = request.dataValue.paymentterms;
      var getterms = "";
      if (dataValue11 == "1") {
        getterms = "账期";
      } else if (dataValue11 == "2") {
        getterms = "往来";
      } else if (dataValue11 == "3") {
        getterms = "承兑";
      } else if (dataValue11 == "4") {
        getterms = "现金";
      }
      let dataValue12 = request.dataValue.bankaccount;
      let dataValue13 = request.dataValue.openbankaccount;
      let dataValue14 = request.dataValue.code;
      let dataValue15 = request.dataValue.paymentrequestSubform20221228List[0].hetong_test111;
      let dataValue17 = request.dataValue.paymentrequestSubform20221228List[0].hetong_test222;
      let dataValue18 = request.dataValue.paymentrequestSubform20221228List[0].hetong_new5;
      //调用oa接口
      let secondurl = "http://218.4.202.238:8999/seeyon/rest/bpm/process/start?token=" + res;
      let secondbody = {
        data: {
          data: {
            formmain_7667: {
              单据编号: dataValue14,
              填报日期: dataValue4,
              申请组织: dataValue5,
              申请人: dataValue1,
              收款单位: dataValue3,
              银行账号: dataValue13,
              开户行: dataValue12,
              付款总金额: dataValue6,
              审批状态: getstatus,
              订单总金额: dataValue8,
              付款类型: gettype,
              付款比例: dataValue10,
              付款方式: getterms,
              申请部门: dataValue5,
              备注: dataValue7
            },
            formson_7669: [
              {
                合同编号: dataValue15,
                合同名称: dataValue17,
                订单金额: dataValue18
              }
            ]
          },
          draft: "0",
          templateCode: "payment_request",
          attachments: []
        },
        appName: "collaboration"
      };
      //查询对应的一条数据
      var sql1 = " select * from AT168516D809980006.AT168516D809980006.paymentrequest20221228  where code = '" + dataValue14 + "'";
      var res1 = ObjectStore.queryByYonQL(sql1);
      var str1 = "提交失败，处于审批中或已经审批成功";
      var str2 = "提交成功";
      var str4 = "提交失败，查询失败";
      if (res1.length != 0) {
        let status = res1[0].approvalstatus;
        if (status == "2" || status == "3") {
          return { str: str1 };
        } else {
          //修改页面显示的审批状态
          var object = { id: res1[0].id, approvalstatus: "2" };
          var resup = ObjectStore.updateById("AT168516D809980006.AT168516D809980006.paymentrequest20221228", object, "d32021b9List");
          //发送post
          var resup = ObjectStore.updateById("AT168516D809980006.AT168516D809980006.paymentrequest20221228", object, "d32021b9List");
          var secondapiResponse = openLinker("post", secondurl, "AT168516D809980006", JSON.stringify(secondbody));
          var next = JSON.parse(secondapiResponse);
          var after = next.data.app_bussiness_data;
          var then = JSON.parse(after).summaryId;
          var str3 = "错误:" + secondapiResponse.errorMsg;
          if (!then) {
            return { str: str3 };
          }
        }
        //   走提交
        return { str: str2 };
      } else {
        return { str: str4 };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });