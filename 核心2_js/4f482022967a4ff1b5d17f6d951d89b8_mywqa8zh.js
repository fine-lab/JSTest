let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    for (var i = 0; i < datas.length; i++) {
      makeheadinfo(datas[i]);
      var recBuDetObjList = datas[i].payBuDetObjList;
      for (var j = 0; j < recBuDetObjList.length; j++) {
        makebodyinfo(recBuDetObjList[j]);
        var recBuPlanObjList = recBuDetObjList[j].payBuplanObjList;
        for (var k = 0; k < recBuPlanObjList.length; k++) {
          makeSoninfo(recBuPlanObjList[k]);
        }
      }
    }
    let returns = ObjectStore.insert("AT175542E21C400007.AT175542E21C400007.payBusObject", datas, "paytrabuobject");
    let param = { return: returns };
    let func = extrequire("AT175542E21C400007.backDesignerFunction.savepaybusiness");
    let res = func.execute(param);
    return { res };
    function makeheadinfo(datahead) {
      datahead.financeOrg = queryFinanceOrgID(datahead);
      datahead.org_id = queryOrgID(datahead.org_id);
      datahead.supplier = querySupplierID(datahead);
      datahead.employee = queryemployeeID(datahead.employee);
      datahead.oriCurrency = queryCurrencyID(datahead.oriCurrency);
      datahead.accCurrency = queryCurrencyID(datahead.accCurrency);
      datahead.orgCurrency = queryCurrencyID(datahead.orgCurrency);
    }
    function makebodyinfo(databody) {
      databody.oriCurrency = queryCurrencyID(databody.oriCurrency);
      databody.taxSubject = querytaxSubjectID(databody.taxSubject);
      databody.accExchangeRateType = queryaccExchangeRateTypeID(databody.accExchangeRateType);
      databody.expenseItem = queryaccexpenseitemID(databody.expenseItem);
      databody.unit = queryaccmaterialUnitID(databody.unit);
      databody.material = queryaccmaterialID(databody.material);
      databody.dept = queryAdminOrgVOID(databody.dept);
      databody.invoiceType = querynvoiceTypeID(databody.invoiceType);
      databody.staff = queryemployeeID(databody.staff);
      databody.costCenter = queryCostCenterClassID(databody.costCenter);
      databody.inventoryOrg = queryOrgID(databody.inventoryOrg);
      databody.amountOrg = queryOrgID(databody.amountOrg);
      databody.payAgreement = querypayAgreementID(databody.payAgreement);
      databody.project = queryprojectID(databody.project);
    }
    function makeSoninfo(datason) {
      datason.financeOrg = queryFinanceOrgID(datason);
      datason.apSubject = queryAccSubjeID(datason.apSubject);
    }
    //付款协议
    function querypayAgreementID(code) {
      let sql = "select * from 		bd.payments.PayAgreement	 where code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //成本中心
    function queryCostCenterClassID(code) {
      let sql = "select * from 		bd.costcenter.CostCenter	 where effect=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "finbd");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //发票类型
    function querynvoiceTypeID(code) {
      let sql = "select * from 		bd.invoice.InvoiceTypeVO	 where enable=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //项目
    function queryprojectID(code) {
      let sql = "select * from 		bd.project.ProjectVO	 where  enable=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //部门
    function queryAdminOrgVOID(code) {
      let sql = "select * from bd.adminOrg.AdminOrgVO where dr=0 and  enable=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "orgcenter");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //物料
    function queryaccmaterialID(code) {
      let sql = "select * from 		pc.product.Product	where  code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "productcenter");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //科目
    function queryAccSubjeID(code) {
      let sql = "select * from 		epub.subject.AccSubject	 where enabled=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "fiepub");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //物料计量单位
    function queryaccmaterialUnitID(code) {
      let sql = "select * from 		aa.product.ProductUnit	where deleted=0 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "productcenter");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //费用项目
    function queryaccexpenseitemID(code) {
      let sql = "select * from 		bd.expenseitem.ExpenseItem	where enabled=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "finbd");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //汇率类型
    function queryaccExchangeRateTypeID(code) {
      let sql = "select * from 		bd.exchangeRate.ExchangeRateTypeVO	where enable=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //税目
    function querytaxSubjectID(code) {
      let sql = "select * from 	bd.taxrate.TaxRateVO where 	enable=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //查询会计主体
    function queryFinanceOrgID(datahead) {
      let sql = "select * from 			org.func.FinanceOrg where enable=1 and code='" + datahead.financeOrg + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "ucf-org-center");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //查询业务组织主键
    function queryOrgID(code) {
      let sql = "select * from 			org.func.BaseOrg where enable=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "ucf-org-center");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //查询供应商主键
    function querySupplierID(datahead) {
      let sql = "select * from 		aa.vendor.Vendor where   code='" + datahead.supplier + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "yssupplier");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //查询员工主键
    function queryemployeeID(code) {
      let sql = "select * from 			bd.staff.StaffNew where dr=0  and  code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "hrcloud-staff-mgr");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
    //查询币种主键
    function queryCurrencyID(code) {
      let sql = "select * from 	bd.currencytenant.CurrencyTenantVO where  enable=1 and code='" + code + "'";
      var res4 = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
      var FinanceOrgID = "";
      if (res4.length > 0) {
        FinanceOrgID = res4[0].id;
      }
      return FinanceOrgID;
    }
  }
}
exports({ entryPoint: MyAPIHandler });