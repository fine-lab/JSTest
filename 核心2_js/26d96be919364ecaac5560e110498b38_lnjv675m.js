let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let paramData = request.requestData; //请求参数
    let paramRetrun = request.return; //请求参数
    let BankAccountListList = paramData.BankAccountListList; //银行信息-自建
    let merchantAgentFinancialInfos = []; //银行信息-系统
    let data = {
      merchantOptions: false, //是否商家
      _status: paramData._status,
      channCustomerClass: "2057408519067136"
    }; //客户档案对象
    if (paramData._status === "Update") {
      data.id = paramData.merchant;
    }
    if (paramData.org_id !== undefined) {
      data.createOrg = paramData.org_id;
    }
    if (paramData.code !== undefined) {
      data.code = paramData.code;
    }
    if (paramData.merchantName !== undefined) {
      data.name = paramData.merchantName;
    }
    if (paramData.enterprisetype !== undefined) {
      data.enterpriseNature = paramData.enterprisetype;
    }
    if (BankAccountListList !== undefined) {
      for (let i = 0; i < BankAccountListList.length; i++) {
        let BankAccount = BankAccountListList[i]; //银行信息-自建
        let merchantAgent = {
          country: "0040be98-735b-44c0-afe5-54d11a96037b",
          currency: "G001ZM0000DEFAULTCURRENCT00000000001",
          _status: BankAccount._status,
          accountType: "1"
        };
        if (BankAccount._status === "Update") {
          merchantAgent.id = BankAccount.sysBankNumberId;
        }
        let BankAccountArr = Object.keys(BankAccount); //自建银行信息记录的key值
        for (let j = 0; j < BankAccountArr.length; j++) {
          //循环key值
          let BankAccountkey = BankAccountArr[j];
          switch (BankAccountkey) {
            case "bankAccount":
              merchantAgent.bankAccount = BankAccount.bankAccount;
              break;
            case "openBank":
              merchantAgent.openBank = BankAccount.openBank;
              break;
            case "bank":
              merchantAgent.bank = BankAccount.bank;
              break;
            case "bankAccountName":
              merchantAgent.bankAccountName = BankAccount.bankAccountName;
              break;
            case "isdefault":
              merchantAgent.isDefault = BankAccount.isdefault;
              break;
            case "memo":
              merchantAgent.remarks = BankAccount.memo;
              break;
            case "jointLineNo":
              merchantAgent.jointLineNo = BankAccount.jointLineNo;
          }
        }
        merchantAgentFinancialInfos.push(merchantAgent);
      }
    }
    data.merchantAgentFinancialInfos = merchantAgentFinancialInfos;
    let merchantApplyRanges = []; //客户适用组织
    merchantApplyRanges.push({
      rangeType: "1",
      orgId: paramData.org_id,
      isCreator: "true",
      isApplied: "false",
      _status: paramData._status
    });
    data.merchantApplyRanges = merchantApplyRanges;
    let merchantAppliedDetail = {
      exchangeratetype: "lnjv675m",
      payway: "99"
    };
    if (paramRetrun) {
      merchantAppliedDetail.creator = paramRetrun.creator;
    }
    if (paramRetrun) {
      merchantAppliedDetail.modifier = paramRetrun.modifier;
    }
    data.merchantAppliedDetail = merchantAppliedDetail;
    request = {};
    request.uri = "/yonbip/digitalModel/merchant/save";
    request.body = { data: data };
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let res = func.execute(request).res;
    if (res.code === "200") {
      var object1 = { id: paramRetrun.id, merchant: res.data.id, merchantCode: res.data.code, ManageDept: paramData.ManageDept, custCategory: res.data.customerClass };
      var res1 = ObjectStore.updateById("GT34544AT7.GT34544AT7.BankAccountAll", object1, "932de513");
      for (let k = 0; k < paramRetrun.BankAccountListList.length; k++) {
        object1 = {
          id: paramRetrun.BankAccountListList[k].id,
          merchant: res.data.id,
          sysBankNumberId: res.data.merchantAgentFinancialInfos[k].id,
          OrgCode: paramData.OrgCode,
          OrgID: paramData.org_id,
          ManageDeptCode: paramData.ManageDeptCode,
          ManageDept: paramData.ManageDept
        };
        res1 = ObjectStore.updateById("GT34544AT7.GT34544AT7.BankAccountList", object1, "d5ec097e");
      }
    } else {
      throw new Error("同步失败！请联系管理员" + JSON.stringify(res));
    }
    res.rq = data;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });