let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let bsdata = request.bsdata;
    let detail = request.detail;
    let url = "https://www.example.com/" + access_token;
    let bodiesArr = new Array(detail.length);
    let numIndex = 0;
    for (let i = 0; i < detail.length; i++) {
      let debit = {};
      if (detail[i].debit_dept === undefined || detail[i].debit_dept === null || detail[i].debit_dept === "") {
        detail[i].debit_dept = detail[i].credit_dept;
      }
      if (detail[i].debit_project === undefined || detail[i].debit_project === null || detail[i].debit_project === "") {
        detail[i].debit_project = detail[i].credit_project;
      }
      let debit_clientauxiliary = [
        {
          field: "vr1",
          value: detail[i].debit_dept
        },
        {
          field: "vr2",
          value: detail[i].debit_project
        }
      ];
      debit["description"] = detail[i].description;
      debit["recordnumber"] = i + 1;
      debit["accsubject"] = detail[i].debit_subjects = null ? detail[i].credit_subjects : detail[i].debit_subjects;
      debit["currency"] = bsdata.currency;
      debit["debit_original"] = detail[i].debit_amount;
      debit["credit_original"] = detail[i].credit_amount;
      debit["debit_org"] = detail[i].debit_amount;
      debit["credit_org"] = detail[i].credit_amount;
      debit["rate_org"] = 1;
      debit["ratetype"] = bsdata.ratetype;
      debit["quantity"] = 0;
      debit["secondorg"] = bsdata.pk_org;
      debit["clientauxiliary"] = debit_clientauxiliary;
      bodiesArr[i] = debit;
    }
    let vo = {
      voucherVO: {
        pk_org: bsdata.pk_org,
        accbook: bsdata.accbook,
        period: bsdata.period,
        maker: bsdata.creator,
        maketime: new Date().getTime(),
        vouchertype: bsdata.vouchertype,
        srcsystemid: bsdata.srcsystemid,
        totaldebit_org: bsdata.totaldebit_org,
        totalcredit_org: bsdata.totalcredit_org,
        attachedbill: detail[0].settlementCount,
        bodies: bodiesArr
      },
      reqid: uuid(),
      businessid: bsdata.businessid
    };
    var voJson = JSON.stringify(vo);
    var strResponse = postman("post", url, null, voJson);
    return { voucherResp: strResponse, voJson };
  }
}
exports({ entryPoint: MyAPIHandler });