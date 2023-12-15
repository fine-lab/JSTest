let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var requestData = param.requestData;
    let requestdata = "";
    if (Object.prototype.toString.call(requestData) === "[object Array]") {
      requestdata = requestData[0];
    }
    if (Object.prototype.toString.call(requestData) === "[object String]") {
      requestdata = JSON.parse(requestData);
    }
    var settlementid;
    if (requestdata.id == null) {
      //判断requestdata中是否有id
      settlementid = requestdata[0].id; //前端传的数据id，根据数据id去查数据库
    } else {
      settlementid = requestdata.id; //前端传的数据id，根据数据id去查数据库
    }
    //根据id去查结算申请单
    var sql1 = "select * from usmp.settlementapply.SettlementApply where id = '" + settlementid + "'";
    var Settlement = ObjectStore.queryByYonQL(sql1, "yycrm");
    //根据id查结算申请单详情
    var sql2 = "select * from usmp.settlementapply.SettlementApplyInfo where settlementApplyId = '" + settlementid + "'";
    var SettlementInfo = ObjectStore.queryByYonQL(sql2, "yycrm");
    //获取单据组织
    let orgid = Settlement[0].orgId;
    var sql3 = "select code from org.func.BaseOrg where id = '" + orgid + "'";
    var orgcode = ObjectStore.queryByYonQL(sql3, "yycrm");
    //获取员工编码
    let psnid = Settlement[0].applicant;
    var sql4 = "select code from bd.staff.Staff where id = '" + psnid + "'";
    var psncode = ObjectStore.queryByYonQL(sql4, "yycrm");
    //获取单据部门
    let deptid = Settlement[0].department;
    var sql5 = "select code from bd.adminOrg.DeptOrgVO where id = '" + deptid + "'";
    var deptcode = ObjectStore.queryByYonQL(sql5, "yycrm");
    //获取单据币种
    let currencyid = Settlement[0].currency;
    var sql9 = "select code from bd.currencytenant.CurrencyTenantVO where id = '" + currencyid + "'";
    var currencycode = ObjectStore.queryByYonQL(sql9);
    let body = [];
    //循环子表获取子表信息
    for (let i = 0; i < SettlementInfo.length; i++) {
      let SettlementInfoData = SettlementInfo[i];
      //获取费用类型
      let expensetypeid = SettlementInfoData.dimension_expense_itemType;
      var sql6 = "select name from 	bd.expenseitem.ExpenseItemType where id = '" + expensetypeid + "'";
      var expensetype = ObjectStore.queryByYonQL(sql6, "yycrm");
      //获取费用项
      let expenseid = SettlementInfoData.dimension_expense_item;
      var sql7 = "select name from bd.expenseitem.ExpenseItem where id = '" + expenseid + "'";
      var expenset = ObjectStore.queryByYonQL(sql7, "yycrm");
      //获取结算类型----CRM：客户1 供应商2 个人3 散户4 其他5;NCC:1:供应商；2:部门；3:业务员
      let settlementtype = SettlementInfoData.settlementType;
      let settlement;
      let supplierid = SettlementInfoData.settle_vendor; //供应商
      var sql8 = "select code,name from aa.vendor.Vendor where id = '" + supplierid + "'";
      var supplier = ObjectStore.queryByYonQL(sql8, "yycrm");
      //获取结算方式
      //获取物料
      let item = {
        bill_date: Settlement[0].createDate, //单据日期
        bill_type: "F5", //单据类型---默认F5付款结算单
        trade_type: "F5-Cxx-FYJSD", //付款结算类型
        pay_primal: SettlementInfoData.settleAmount, //付款原币金额
        direction: "-1", //方向，默认-1付款
        objecttype: "1", //交易对象类型，默认供应商
        pk_supplier: supplier[0].code, //供应商
        pk_account: SettlementInfoData.bankAccount, //收款银行账户
        pk_balatype: "3", //结算方式
        paystatus: "1" //支付状态
      };
      body.push(item);
    }
    let head = {
      pk_group: "0001A110000000000E08", //集团，默认百乐
      primal_money: Settlement[0].settleAmountTotal, //付款原币金额
      bill_date: Settlement[0].createDate, //单据日期
      pk_currtype: currencycode[0].code, //币种
      bill_type: "F5", //单据类型---默认F5付款结算单
      trade_type: "F5-Cxx-FYJSD", //付款结算类型
      source_flag: "2", //来源系统--默认现金管理
      pk_org: orgcode[0].code, //组织
      creator: psncode[0].code, //-创建人
      bill_accounting_period: "10", //会计期间
      memo: Settlement[0].remark, //备注
      def1: Settlement[0].code //单据编码
    };
    let json = {
      body: body, //子表
      head: head
    };
    //调用NCC接口同步单据
    let url = "http://ncctest.pilotpen.com.cn:9080/uapws/rest/total/PayableOrder";
    var strResponse = JSON.parse(postman("post", url, null, JSON.stringify(json)));
    if (strResponse.status == 1) {
      throw new Error("NCC:" + strResponse.msg);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });