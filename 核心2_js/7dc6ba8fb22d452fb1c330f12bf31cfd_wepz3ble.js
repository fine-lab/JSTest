let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    if ("1" === data.billstatus) {
      let errresp = { code: "-1", message: "该单据已生成凭证，不能重复生成！" };
      return { resp: JSON.stringify(errresp) };
    }
    let appkey = "yourkeyHere";
    let appsecrect = "7836b880d11b406085f2dad91aa1e8b0";
    let tokenFun = extrequire("GT17832AT1.common.getToken");
    let tokenRes = tokenFun.execute({ appkey: appkey, appsecrect: appsecrect }, null);
    let access_token = tokenRes.access_token;
    let businessid = data.id;
    var detailsql = "select org,project,description,debit_subjects,credit_subjects,customer,amount  from GT17832AT1.GT17832AT1.smarttourismdetail where smarttourismdetailFk ='" + businessid + "'";
    var detail = ObjectStore.queryByYonQL(detailsql);
    let exchangeRateFun = extrequire("GT17832AT1.common.getExchangeRateType");
    let exchangeRateRes = exchangeRateFun.execute({ access_token: access_token, rateCode: "01" }, null);
    let ratetype = exchangeRateRes.ratetype;
    let currencyFun = extrequire("GT17832AT1.common.getCurrency");
    let currencyResp = currencyFun.execute({ access_token: access_token }, null);
    let currency = currencyResp.currency;
    let vouchertypeFun = extrequire("GT17832AT1.common.getVoucherType");
    let vouchertypeResp = vouchertypeFun.execute({ access_token: access_token, typecode: "1" }, null);
    let vouchertype = vouchertypeResp.vouchertype;
    let accbookFun = extrequire("GT17832AT1.common.getAccBook");
    let accbookResp = accbookFun.execute({ access_token: access_token, orgName: detail[0].org }, null);
    let accbook = accbookResp.accbook;
    let orgFun = extrequire("GT17832AT1.common.getOrgByNameOrCode");
    let orgResp = orgFun.execute({ access_token: access_token, orgName: detail[0].org }, null);
    let pk_org = orgResp.pk_org;
    let customerFun = extrequire("GT17832AT1.common.getCustomer");
    let totaldebit_org = 0;
    let totalcredit_org = 0;
    let subFun = extrequire("GT17832AT1.common.getSubjects");
    let projectFun = extrequire("GT17832AT1.common.getProject");
    for (let detailvo of detail) {
      let debit_vr1;
      let debit_vr2;
      let credit_vr1;
      let credit_vr2;
      detailvo.debit_amount = detailvo.amount;
      detailvo.credit_amount = detailvo.amount;
      let debitprojectResp = projectFun.execute({ access_token: access_token, projectCode: detailvo.project }, null);
      let debitprojects = debitprojectResp.project;
      if (debitprojects.length === 1) {
        debit_vr1 = debitprojects[0].id;
        credit_vr1 = debitprojects[0].id;
      } else {
        for (let debit of debitprojects) {
          if (debit.code === detailvo.project) {
            detailvo.debit_project = debit.id;
            debit_vr1 = debit.id;
            credit_vr1 = debit.id;
            break;
          }
        }
      }
      //客户
      let debitcustResp = customerFun.execute({ access_token: access_token, org: pk_org, custCode: detailvo.customer }, null);
      debit_vr2 = debitcustResp.cust;
      credit_vr2 = debitcustResp.cust;
      //获取科目
      let debitsubResp = subFun.execute({ access_token: access_token, subjectCode: detailvo.debit_subjects }, null);
      detailvo.debit_subjects = debitsubResp.subjectsid;
      let crebitsubResp = subFun.execute({ access_token: access_token, subjectCode: detailvo.credit_subjects }, null);
      detailvo.credit_subjects = crebitsubResp.subjectsid;
      //借方、贷方总金额计算
      if ("" === detailvo.amount || undefined === detailvo.amount) {
        detailvo.amount = 0;
      }
      totaldebit_org = new Big(totaldebit_org).plus(detailvo.amount);
      totalcredit_org = totaldebit_org;
      detailvo.debit_vr1 = debit_vr1;
      detailvo.debit_vr2 = debit_vr2;
      detailvo.credit_vr1 = credit_vr1;
      detailvo.credit_vr2 = credit_vr2;
    }
    var appContext = AppContext();
    let creator = JSON.parse(appContext).currentUser.id;
    let srcsystemid = "youridHere";
    let debit_field_vr1 = "vr2";
    let debit_field_vr2 = "vr5";
    let credit_field_vr1 = "vr2";
    let credit_field_vr2 = "vr5";
    let bsdata = {
      ratetype,
      currency,
      vouchertype,
      accbook,
      pk_org,
      totaldebit_org,
      totalcredit_org,
      srcsystemid,
      businessid,
      creator,
      debit_field_vr1,
      debit_field_vr2,
      credit_field_vr1,
      credit_field_vr2
    };
    let voucherSaveFun = extrequire("GT17832AT1.common.postVoucherSave");
    let voucherSaveResp = voucherSaveFun.execute({ access_token: access_token, bsdata: bsdata, detail: detail, billtypes: 2 }, null);
    let resp = voucherSaveResp.voucherResp;
    let result = JSON.parse(resp);
    if ("200" === result.code) {
      var object = { id: businessid, billstatus: "1", subTable: [{ hasDefaultInit: true, key: "yourkeyHere", _status: "Update" }] };
      var res = ObjectStore.updateById("GT17832AT1.GT17832AT1.smarttourism", object, "smarttourism");
    }
    return {
      resp,
      voucherSaveResp
    };
  }
}
exports({ entryPoint: MyAPIHandler });