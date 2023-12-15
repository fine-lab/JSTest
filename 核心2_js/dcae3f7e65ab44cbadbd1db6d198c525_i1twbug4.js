let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    //组织
    var orgid = pdata.createOrg;
    var sql = "select * from org.func.BaseOrg where id ='" + orgid + "'";
    var res = ObjectStore.queryByYonQL(sql, "orgcenter");
    var orgid = res.objid;
    //编码
    var code = pdata.code;
    //名称
    var name = pdata.name.zh_CN;
    //简称
    var shortname = pdata.shortname.zh_CN;
    //客户类型
    var suppliers = pdata.suppliers;
    var sql = "select * from 		aa.vendor.Vendor	 where id ='" + suppliers + "'";
    var res = ObjectStore.queryByYonQL(sql, "yssupplier");
    var supplier = res.erpCode;
    var creditCode = pdata.creditCode;
    var mobile = pdata.mobile;
    var parentCustomer = pdata.parentCustomer;
    var sql = "select * from 		aa.merchant.Merchant	 where id ='" + parentCustomer + "'";
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    var parentCustomer = res.erpCode;
    throw new Error(JSON.stringify(pdata));
    //客户分类 1502621057717108788
    var customerClass = pdata.customerClass;
    var sql = "select * from 	aa.custcategory.Custcategory	 where id ='" + customerClass + "'";
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    var pk_custclass = res.cErpCode;
    // 地址
    var address = "";
    var zipCode = "";
    if (pdata.merchantAddressInfos != null) {
      var addressobj = pdata.merchantAddressInfos[0];
      //详细地址
      var address = addressobj.mergerName;
      //邮编
      var zipCode = addressobj.zipCode;
    }
    var taxNo = "";
    if (pdata.merchantAgentInvoiceInfos != null) {
      //税号
      var invoiceobj = pdata.merchantAgentInvoiceInfos[0];
      var taxNo = invoiceobj.taxNo;
    }
    var currency = "";
    var mnecode = "";
    if (pdata.merchantApplyRanges != null) {
      var bizobj = pdata.merchantApplyRanges[0];
      var a = "merchantAppliedDetail!transactionCurrency";
      var b = "merchantAppliedDetail!searchcode";
      var mnecode = bizobj[b];
      var currency = bizobj[a];
      var sql = "select * from  bd.currencytenant.CurrencyTenantVO where id ='youridHere'";
      var res1 = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
      var currency = res1.objid;
    }
    var parentCustomer = pdata.parentCustomer;
    var object = {
      id: parentCustomer
    };
    var Customerres = ObjectStore.selectById("aa.merchant.Merchant", object);
    var parentCustomer = Customerres.erpCode;
    var req = {
      code: code,
      name: name,
      shortname: shortname,
      pk_custclass: pk_custclass,
      companyaddress: address,
      postcode: zipCode,
      custprop: 0,
      accnum: taxNo,
      mnecode: mnecode,
      parentcustomer: parentCustomer,
      pk_currtype: currency
    };
    return {};
  }
}
exports({ entryPoint: MyTrigger });