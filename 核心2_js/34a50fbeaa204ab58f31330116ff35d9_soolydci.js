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
    var detailsql =
      "select org,project,description,debit_subjects,credit_subjects,supplier,dept,settlementCount,amount from GT20457AT2.GT20457AT2.suppcostvouchdetail where suppcostvouchdetailFk ='" +
      businessid +
      "'";
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
    let deptFun = extrequire("GT20457AT2.common.getdept");
    let deptResp = deptFun.execute({ access_token: access_token, org: pk_org }, null);
    let deptarr = deptResp.dept.data;
    for (let dept of deptarr) {
      for (let detailvo of detail) {
        if (detailvo.dept === dept.name) {
          detailvo.dept = dept.id;
        }
      }
    }
    let totaldebit_org = 0;
    let totalcredit_org = 0;
    let subFun = extrequire("GT20457AT2.common.getSubjects");
    let projectFun = extrequire("GT20457AT2.common.getProject");
    let supplerFun = extrequire("GT20457AT2.common.getsupplier");
    for (let detailvo of detail) {
      let debitsubResp = subFun.execute({ access_token: access_token, subjectCode: detailvo.debit_subjects }, null);
      detailvo.debit_subjects = debitsubResp.subjectsid;
      let projectResp = projectFun.execute({ access_token: access_token, projectCode: detailvo.project }, null);
      let project = projectResp.project;
      if (project.length === 1) {
        detailvo.project = project[0].id;
      } else {
        for (let pro of project) {
          if (pro.code === detailvo.project) {
            detailvo.debit_project = pro.id;
          }
        }
      }
      let crebitsubResp = subFun.execute({ access_token: access_token, subjectCode: detailvo.credit_subjects }, null);
      detailvo.credit_subjects = crebitsubResp.subjectsid;
      let supplerResp = supplerFun.execute({ access_token: access_token, supcode: detailvo.supplier, pkorg: pk_org }, null);
      let supplier = supplerResp.supplier;
      detailvo.supplier = supplier.id;
      //借方、贷方总金额计算
      if ("" === detailvo.amount || undefined === detailvo.amount) {
        detailvo.amount = 0;
      }
      totaldebit_org = new Big(totaldebit_org).plus(detailvo.amount);
      totalcredit_org = new Big(totalcredit_org).plus(detailvo.amount);
    }
    var appContext = AppContext();
    let creator = JSON.parse(appContext).currentUser.id;
    let srcsystemid = "youridHere";
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
      creator
    };
    let voucherSaveFun = extrequire("GT20457AT2.suppcostvoucher.postSuppVoucherSave");
    let voucherSaveResp = voucherSaveFun.execute({ access_token: access_token, bsdata: bsdata, detail: detail }, null);
    let resp = voucherSaveResp.voucherResp;
    let result = JSON.parse(resp);
    if ("200" === result.code) {
      var object = { id: businessid, billstatus: "1", subTable: [{ hasDefaultInit: true, key: "yourkeyHere", _status: "Update" }] };
      var res = ObjectStore.updateById("GT20457AT2.GT20457AT2.suppcostvouch", object, "suppcostvouch");
    }
    return {
      resp,
      voucherSaveResp
    };
  }
}
exports({ entryPoint: MyAPIHandler });