let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    var id = pdata.id;
    var cuserid = "";
    //组织
    var orgid = pdata.createOrg;
    var sql = "select * from org.func.BaseOrg where id ='" + orgid + "'";
    var res = ObjectStore.queryByYonQL(sql, "orgcenter");
    var orgid = res[0].objid;
    //编码
    var code = pdata.code;
    //名称
    var name = pdata.name.zh_CN;
    //简称
    var shortname = null;
    if (pdata.shortname != null && pdata.shortname != {}) {
      var shortname = pdata.shortname.zh_CN;
    }
    var suppliers = pdata.suppliers;
    if (suppliers != null) {
      var sql = "select * from 		aa.vendor.Vendor	 where id ='" + suppliers + "'";
      var res = ObjectStore.queryByYonQL(sql, "yssupplier");
      var supplier = res[0].erpCode;
    }
    var creditCode = pdata.creditCode;
    var mobile = pdata.contactTel;
    var parentCustomer = pdata.parentCustomer;
    if (parentCustomer != null) {
      var sql = "select * from 		aa.merchant.Merchant	 where id ='" + parentCustomer + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      var parentCustomer = res[0].erpCode;
    }
    debugger;
    var customerClass = pdata.customerClass;
    var pk_custclass = "";
    if (customerClass != null) {
      var sql = "select * from 	aa.custcategory.CustCategory	 where id ='" + customerClass + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      var pk_custclass = res[0].erpCode;
    }
    var address1 = "";
    var receievInvoiceMobile = "";
    if (pdata.merchantAgentInvoiceInfos != null && pdata.merchantAgentInvoiceInfos.length > 0) {
      var addressobj = pdata.merchantAgentInvoiceInfos[0];
      var receievInvoiceMobile = addressobj.receievInvoiceMobile;
      //详细地址
      address1 = addressobj.address.zh_CN;
      if (address1 == null) {
        address1 = addressobj.address;
      }
    }
    //家居棉 1550815263712608260 座椅 1550815323843198978    客户所属行业
    var define1 = null;
    if (pdata.merchantDefine != [] && pdata.merchantDefine != {} && pdata.merchantDefine != null) {
      if (pdata.merchantDefine.define1 != {}) {
        var define1 = pdata.merchantDefine.define1;
      }
    }
    var date = pdata.buildTime;
    var oTime1 = "";
    if (date != null) {
      var oDate = new Date(date);
      var oYear = oDate.getFullYear();
      var oMonth = oDate.getMonth() + 1;
      if (parseInt(oMonth) < 10) {
        oMonth = "0" + oMonth;
      }
      var oDay = oDate.getDate();
      if (parseInt(oDay) < 10) {
        oDay = "0" + oDay;
      }
      var oHour = oDate.getHours();
      if (parseInt(oHour) < 10) {
        oHour = "0" + oHour;
      }
      var oMin = oDate.getMinutes();
      if (parseInt(oMin) < 10) {
        oMin = "0" + oMin;
      }
      var oSen = oDate.getSeconds();
      if (parseInt(oSen) < 10) {
        oSen = "0" + oSen;
      }
      //时间
      var oTime1 = oYear + "-" + oMonth + "-" + oDay + " " + oHour + ":" + oMin + ":" + oSen;
    }
    var leader = pdata.leaderName;
    var money = pdata.money;
    var fax = pdata.fax;
    var email = pdata.email;
    var bankinfosobj = [];
    var bankinfos = pdata.merchantAgentFinancialInfos;
    if (bankinfos != null && bankinfos.length > 0) {
      for (var i = 0; i < bankinfos.length; i++) {
        var bankinfo = bankinfos[i];
        var bankinfoobj = {};
        var bankAccount = bankinfo.bankAccount;
        var bankAccountName = bankinfo.bankAccountName;
        var openBank_name = bankinfo.openBank_name;
        var isdefault = bankinfo.isDefault;
        var banktype_name = bankinfo.bank_name;
        var banktype = bankinfo.bank;
        var sql = "select * from  bd.bank.BankVO	 where id ='" + banktype + "'";
        var res = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
        //银行信息中没有NCC主键 无法传输
        var bankcurrency = bankinfo.currency;
        var sql = "select * from   bd.currencytenant.CurrencyTenantVO	 where id ='" + bankcurrency + "'";
        var res = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
        var bankcurrency = res[0].objid;
        var bankinfoobj = {
          bankaccount: bankAccount,
          accountname: bankAccountName,
          bankname: openBank_name,
          isdefault: isdefault,
          bankcategory: banktype_name,
          bankcurrency: bankcurrency
        };
        bankinfosobj.push(bankinfoobj);
      }
    }
    var req = {
      id: id,
      code: code,
      cuserid: cuserid,
      name: name,
      orgid: orgid,
      shortname: shortname,
      supplier: supplier,
      creditCode: creditCode,
      mobile: mobile,
      parentCustomer: parentCustomer,
      pk_custclass: pk_custclass,
      companyaddress: address1,
      mobile: receievInvoiceMobile,
      buildTime: oTime1,
      leader: leader,
      money: money,
      fax: fax,
      email: email,
      banklist: bankinfosobj
    };
    var url = "http://222.134.95.58:8091/service/CreateCustomerNcSynAbstractServlet";
    let header = {
      "Content-type": "application/json;charset=utf-8"
    };
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(req));
    var rs = JSON.parse(strResponse);
    if (rs.result == "0") {
      throw new Error(JSON.stringify(strResponse));
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});