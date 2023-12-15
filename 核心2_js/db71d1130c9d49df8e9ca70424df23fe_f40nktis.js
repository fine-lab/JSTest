let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    let currentUserInfo = JSON.parse(res).currentUser;
    let result = "";
    result = `id---${currentUserInfo.id},name----${currentUserInfo.name},code----${currentUserInfo.code}`;
    var userId = JSON.parse(AppContext()).currentUser.id;
    var sql_dept =
      "select mainJobList.dept_id, mainJobList.dept_id.name, mainJobList.dept_id.code, mainJobList.post_id, mainJobList.post_id.name from bd.staff.StaffNew where user_id ='" + userId + "'";
    var deptObj = ObjectStore.queryByYonQL(sql_dept, "ucf-staff-center");
    let deptInfo = {};
    if (deptObj.length > 0) {
      deptInfo = deptObj[0];
    } else {
      deptInfo.code = "";
    }
    let data = {};
    let clientRefundId = "";
    if (param != null && param != undefined) {
      data = param.data[0];
      clientRefundId = data.id;
      var sqlExec = `select * from GT8429AT6.GT8429AT6.extend_client_refund_apply where id ='youridHere'`;
      var clientRefundInfo = ObjectStore.queryByYonQL(sqlExec, "developplatform");
      if (clientRefundInfo != null && clientRefundInfo != undefined) {
        let mock = false;
        // 构建请求apiData入参
        var request = {};
        // 设置入参字段_status为更新
        request._status = "Insert";
        request.customer_retailInvestors = true;
        request.redflag = true;
        request.initflag = true;
        request.isWfControlled = true;
        request.natCurrency_priceDigit = clientRefundInfo[0].natCurrency_priceDigit;
        request.period = clientRefundInfo[0].period;
        if (mock) {
          request.exchangeRateType_code = "01";
          request.vouchdate = "2022-11-25";
          request.exchRate = 1;
          request.currency = "2703359283451904";
          request.natCurrency = "2703359283451904";
          request.accentity_code = "Glfz001";
          request.customer_code = "00020000000001";
          request.tradetype_code = "arap_payment_other";
        } else {
          // 必填-汇率类型档案编码
          request.exchangeRateType_code = "01";
          // 必填-单据日期
          request.vouchdate = clientRefundInfo[0].vouchdate;
          // 必填-原币币种id
          request.currency = "2703359283451904";
          // 必填-本币币种id
          request.natCurrency = "2703359283451904";
          // 必填-会计主体编码
          request.accentity_code = "GFZ-0001";
          // 会计主体名称
          request.accentity_name = "高尓夫尊（北京）科技有限公司";
          // 会计主体
          request.accentity = "2703359283451904";
          // 客户Id
          request.customer = clientRefundInfo[0].client;
          // 必填-客户编码
          request.customer_code = clientRefundInfo[0].customer_code;
          // 客户名称
          if (clientRefundInfo[0].client_name == null && clientRefundInfo[0].client_name == undefined) {
            clientRefundInfo[0].client_name = clientRefundInfo[0].customer_code;
          }
          request.customer_name = clientRefundInfo[0].client_name;
          // 收款银行
          request["headfree!define3"] = clientRefundInfo[0].bank;
          // 银行账号
          request["headfree!define4"] = clientRefundInfo[0].account;
          // 付款内容
          switch (clientRefundInfo[0].paymentContent) {
            case "1":
              request["headfree!define2"] = "保证金";
              request["headItem!define4_name"] = "保证金";
              break;
            case "2":
              request["headfree!define2"] = "门店会员卡";
              request["headItem!define4_name"] = "门店会员卡";
              break;
            case "3":
              request["headfree!define2"] = "门店教练卡";
              request["headItem!define4_name"] = "门店教练卡";
              break;
            case "4":
              request["headfree!define2"] = "代垫款";
              request["headItem!define4_name"] = "代垫款";
              break;
            case "5":
              request["headfree!define2"] = "设备退款";
              request["headItem!define4_name"] = "设备退款";
              break;
            case "6":
              request["headfree!define2"] = "配件退款";
              request["headItem!define4_name"] = "配件退款";
              break;
            default:
              request["headfree!define2"] = "99";
          }
          // 备注
          request.description = clientRefundInfo[0].remark;
          // 付款金额
          request.oriSum = clientRefundInfo[0].amount;
          // 必填-交易类型编码
          request.tradetype_code = "arap_payment_sale";
          // 交易类型名称
          request.tradetype_name = "销售退款";
          // 交易类型
          request.tradetype = "2703359282402095";
          // 结算方式编码
          request.settlemode_code = "system_0001";
          // 结算方式名称
          request.settlemode_name = "银行转账";
          var pageIndex = "1";
          var pageSize = "10";
          let body = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            orgid: "youridHere"
          };
          var strResponseBank = openLinker("POST", "https://www.example.com/", "GT8429AT6", JSON.stringify(body));
          var responseObjBank = JSON.parse(strResponseBank);
          if (responseObjBank.data != undefined || responseObjBank.data != null) {
            //判断如果存在多条记录，取默认值
            if (responseObjBank.data.recordList.length > 0) {
              for (let index = 0; index < responseObjBank.data.recordList.length; index++) {
                let currentData = responseObjBank.data.recordList[index];
                if (currentData.currencyList[0].isdefault == true) {
                  request.enterprisebankaccount_name = currentData.name;
                  request.enterprisebankaccount_code = currentData.code;
                  break;
                }
              }
            } else {
              let currentData = responseObjBank.data.recordList[0];
              request.enterprisebankaccount_name = currentData.name;
              request.enterprisebankaccount_code = currentData.code;
            }
          }
          // 必填-汇率
          request.exchRate = 1;
          // 业务员编码
          request.operator_code = currentUserInfo.code;
          // 业务员名称
          request.operator_name = currentUserInfo.name;
          // 部门id
          // 部门编码
          request.dept_code = clientRefundInfo[0].apply_user_dept_code;
          // 部门名称
          request.dept_name = clientRefundInfo[0].apply_user_dept;
        }
        var payBillbRequest = {};
        // 必填-款项类型编码
        payBillbRequest.quickType_code = "1";
        // 必填-金额
        payBillbRequest.oriSum = clientRefundInfo[0].amount;
        // 必填-本币金额
        payBillbRequest.natSum = payBillbRequest.oriSum * request.exchRate;
        payBillbRequest._status = "Insert";
        request.PayBillb = [];
        request.PayBillb.push(payBillbRequest);
        var apiData = { data: request };
        // 使用openLinker调用开放接口
        var strResponse = openLinker("POST", "https://www.example.com/", "GT8429AT6", JSON.stringify(apiData));
        var responseObj = JSON.parse(strResponse);
        if (responseObj.code == "200") {
          return { responseObj };
        } else {
          return {};
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });