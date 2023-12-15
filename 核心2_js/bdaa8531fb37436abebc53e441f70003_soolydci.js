let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    if ("1" === data.billstatus) {
      let errresp = { code: "-1", message: "该单据已生成凭证，不能重复生成！" };
      return { resp: JSON.stringify(errresp) };
    }
    let appkey = "yourkeyHere";
    let appsecrect = "ecdc71125bf5432c808d9214d9c5ffd0";
    let tokenFun = extrequire("GT20457AT2.common.getToken");
    let tokenRes = tokenFun.execute({ appkey: appkey, appsecrect: appsecrect }, null);
    let access_token = tokenRes.access_token;
    let businessid = data.id;
    var detailsql = "select org,dept,project,project_type,employee_compensation,amount from GT20457AT2.GT20457AT2.laborcostdetail where laborcostdetailFk ='" + businessid + "'";
    var detail = ObjectStore.queryByYonQL(detailsql);
    let exchangeRateFun = extrequire("GT20457AT2.common.getExchangeRateType");
    let exchangeRateRes = exchangeRateFun.execute({ access_token: access_token, rateCode: "01" }, null);
    let ratetype = exchangeRateRes.ratetype;
    let currencyFun = extrequire("GT20457AT2.common.getCurrency");
    let currencyResp = currencyFun.execute({ access_token: access_token }, null);
    let currency = currencyResp.currency;
    let vouchertypeFun = extrequire("GT20457AT2.common.getVoucherType");
    let vouchertypeResp = vouchertypeFun.execute({ access_token: access_token, typecode: "1" }, null);
    let vouchertype = vouchertypeResp.vouchertype;
    let accbookFun = extrequire("GT20457AT2.common.getAccBook");
    let accbookResp = accbookFun.execute({ access_token: access_token, orgName: detail[0].org }, null);
    let accbook = accbookResp.accbook;
    let orgFun = extrequire("GT20457AT2.common.getOrgByNameOrCode");
    let orgResp = orgFun.execute({ access_token: access_token, orgName: detail[0].org }, null);
    let pk_org = orgResp.pk_org;
    let totaldebit_org = 0;
    let totalcredit_org = 0;
    let projectFun = extrequire("GT20457AT2.common.getProject");
    let projecttypeFun = extrequire("GT20457AT2.common.getprojecttype");
    let deptFun = extrequire("GT20457AT2.common.getdept");
    let deptResp = deptFun.execute({ access_token: access_token, org: pk_org }, null);
    let deptarr = deptResp.dept.data;
    for (let detailvo of detail) {
      let debit_vr1; //辅助核算-项目
      let debit_vr2; //部门
      let credit_vr1;
      let credit_vr2;
      detailvo.description = "计提人工成本";
      let debitprojectResp = projectFun.execute({ access_token: access_token, projectCode: detailvo.project }, null);
      let debitprojects = debitprojectResp.project;
      if (debitprojects.length === 1) {
        debit_vr1 = debitprojects[0].id;
      } else {
        for (let debit of debitprojects) {
          if (debit.code === detailvo.project) {
            debit_vr1 = debit.id;
            break;
          }
        }
      }
      for (let dept of deptarr) {
        if (detailvo.dept === dept.name) {
          debit_vr2 = dept.id;
          credit_vr2 = dept.id;
        }
      }
      let projecttypeResp = projecttypeFun.execute({ access_token: access_token, projectName: detailvo.project_type }, null);
      let project_type = projecttypeResp.projecttype;
      //关联查询报错，暂时使用该方案
      var subcontrastsql = "select id from GT20457AT2.GT20457AT2.subcontrast where org = '" + detailvo.org + "'";
      var subcontrast = ObjectStore.queryByYonQL(subcontrastsql);
      let conids = [];
      for (let con of subcontrast) {
        conids.push(con.id);
      }
      var debitsql =
        "select debit_subject from GT20457AT2.GT20457AT2.subcontrastdetail where subcontrastdetailFk in (" + conids + ") and dept= '" + detailvo.dept + "' and project_type = '" + project_type + "'";
      var debitcon = ObjectStore.queryByYonQL(debitsql);
      if (undefined !== debitcon && debitcon.length > 0) {
        detailvo.debit_subjects = debitcon[0].debit_subject;
      }
      var creditsql =
        "select credit_subject from GT20457AT2.GT20457AT2.subcontrastcredit where subcontrastcreditFk in (" + conids + ") and employee_compensation = '" + detailvo.employee_compensation + "'";
      var creditcon = ObjectStore.queryByYonQL(creditsql);
      if (undefined !== creditcon && creditcon.length > 0) {
        detailvo.credit_subjects = creditcon[0].credit_subject;
      }
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
      detailvo.debit_amount = detailvo.amount;
      detailvo.credit_amount = detailvo.amount;
    }
    var appContext = AppContext();
    let creator = JSON.parse(appContext).currentUser.id;
    let srcsystemid = "youridHere";
    let debit_field_vr1 = "vr2";
    let debit_field_vr2 = "vr1";
    let credit_field_vr1 = "vr2";
    let credit_field_vr2 = "vr1";
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
    let voucherSaveFun = extrequire("GT20457AT2.common.postVoucherSave");
    let voucherSaveResp = voucherSaveFun.execute({ access_token: access_token, bsdata: bsdata, detail: detail, billtypes: 2 }, null);
    let resp = voucherSaveResp.voucherResp;
    let result = JSON.parse(resp);
    if ("200" === result.code) {
      var object = { id: businessid, billstatus: "1", subTable: [{ hasDefaultInit: true, key: "yourkeyHere", _status: "Update" }] };
      var res = ObjectStore.updateById("GT20457AT2.GT20457AT2.laborcost", object, "laborcost");
    }
    return {
      resp,
      voucherSaveResp
    };
  }
}
exports({ entryPoint: MyAPIHandler });