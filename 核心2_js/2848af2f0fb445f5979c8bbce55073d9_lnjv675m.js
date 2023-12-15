let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paramreturn = param.return;
    let rq = JSON.parse(param.requestData);
    let sysStaffId = paramreturn.staffNew;
    let func1 = extrequire("GT34544AT7.staff.showStaffInfoByIdCd");
    let res = func1.execute({ id: sysStaffId });
    let BankAccountListList = rq.BankAccountListList; //自建表的银行账户列表
    let bankAcctList = []; //系统员工的银行账户列表
    for (let i = 0; i < BankAccountListList.length; i++) {
      let BankAccount = BankAccountListList[i];
      let BankAccountKyeArr = Object.keys(BankAccount);
      let sysBankNumber = {
        staff_id: sysStaffId,
        _status: BankAccount._status
      };
      if (BankAccount._status === "Update") {
        if (BankAccount.sysBankNumberId) {
          sysBankNumber.id = BankAccount.sysBankNumberId;
        } else {
          let List = res.res.data.bankAcctList;
          for (let z = 0; z < List.length; z++) {
            if (List[z].account === BankAccount.bankAccount) {
              sysBankNumber.id = BankAccount.sysBankNumberId;
            } else if (List[z].bankname === BankAccount.openBank) {
              sysBankNumber.id = List[z].id;
            }
          }
        }
      }
      for (let j = 0; j < BankAccountKyeArr.length; j++) {
        let bankValue = BankAccountKyeArr[j];
        switch (bankValue) {
          case "bankAccount":
            sysBankNumber.account = BankAccount.bankAccount;
            break;
          case "openBank":
            sysBankNumber.bankname = BankAccount.openBank;
            break;
          case "bank":
            sysBankNumber.bank = BankAccount.bank;
            break;
          case "currency":
            sysBankNumber.currency = BankAccount.currency;
            break;
          case "bankaccttype":
            sysBankNumber.accttype = BankAccount.bankaccttype;
            break;
          case "isdefault":
            sysBankNumber.isdefault = BankAccount.isdefault;
            break;
          case "memo":
            sysBankNumber.memo = BankAccount.memo;
        }
      }
      bankAcctList.push(sysBankNumber);
    }
    let request = {};
    request.uri = "/yonbip/digitalModel/staff/save";
    let addSysStaffData = res.res.data;
    addSysStaffData._status = "Update";
    for (let i = 0; i < addSysStaffData.mainJobList.length; i++) {
      addSysStaffData.mainJobList[i]._status = "Update";
    }
    if (addSysStaffData.ptJobList) {
      delete addSysStaffData.ptJobList;
    }
    if (addSysStaffData.bankAcctList) {
      delete addSysStaffData.bankAcctList;
    }
    addSysStaffData.bankAcctList = bankAcctList;
    request.body = { data: addSysStaffData };
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let sysStaff = func.execute(request).res;
    if (sysStaff.code === "200") {
      for (let i = 0; i < BankAccountListList.length; i++) {
        if (BankAccountListList[i]._status === "Insert") {
          let object3 = {
            id: paramreturn.BankAccountListList[i].id,
            sysBankNumberId: sysStaff.data.bankAcctList[i].id,
            OrgCode: rq.OrgCode,
            OrgID: rq.org_id,
            ManageDeptCode: rq.ManageDeptCode,
            ManageDept: rq.ManageDept
          };
          let res3 = ObjectStore.updateById("GT34544AT7.GT34544AT7.BankAccountList", object3, "eceedc2c");
        }
      }
    } else {
      throw new Error("操作失败！" + JSON.stringify(sysStaff));
    }
    return { sysStaff };
  }
}
exports({ entryPoint: MyTrigger });