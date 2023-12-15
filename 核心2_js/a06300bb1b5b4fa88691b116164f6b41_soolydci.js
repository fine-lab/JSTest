let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let bsdata = request.bsdata;
    let detail = request.detail;
    let billtypes = request.billtypes;
    let url = "https://www.example.com/" + access_token;
    let bodiesArr = new Array(detail.length);
    let numIndex = 0;
    for (let i = 0; i < detail.length; i++) {
      let debit = {};
      let debit_clientauxiliary = [
        {
          field: bsdata.debit_field_vr1,
          value: detail[i].debit_vr1
        },
        {
          field: bsdata.debit_field_vr2,
          value: detail[i].debit_vr2
        }
      ];
      debit["description"] = detail[i].description;
      debit["recordnumber"] = numIndex + 1;
      debit["accsubject"] = detail[i].debit_subjects;
      debit["currency"] = bsdata.currency;
      debit["debit_original"] = detail[i].debit_amount;
      debit["credit_original"] = "";
      debit["debit_org"] = detail[i].debit_amount;
      debit["credit_org"] = "";
      debit["rate_org"] = 1;
      debit["ratetype"] = bsdata.ratetype;
      debit["quantity"] = 0;
      debit["secondorg"] = bsdata.pk_org;
      debit["clientauxiliary"] = debit_clientauxiliary;
      bodiesArr[numIndex] = debit;
      let crebit = {};
      let credi_clientauxiliary = [
        {
          field: bsdata.credit_field_vr1,
          value: detail[i].credit_vr1
        },
        {
          field: bsdata.credit_field_vr2,
          value: detail[i].credit_vr2
        }
      ];
      crebit["description"] = detail[i].description;
      crebit["recordnumber"] = billtypes === 2 ? numIndex + 2 : numIndex + 3;
      crebit["accsubject"] = detail[i].credit_subjects;
      crebit["currency"] = bsdata.currency;
      crebit["debit_original"] = "";
      crebit["credit_original"] = detail[i].credit_amount;
      crebit["debit_org"] = "";
      crebit["credit_org"] = detail[i].credit_amount;
      crebit["rate_org"] = 1;
      crebit["ratetype"] = bsdata.ratetype;
      crebit["quantity"] = 0;
      crebit["secondorg"] = bsdata.pk_org;
      crebit["clientauxiliary"] = credi_clientauxiliary;
      if (1 === billtypes) {
        let debit2 = {};
        debit2["description"] = detail[i].description;
        debit2["recordnumber"] = numIndex + 2;
        debit2["accsubject"] = detail[i].debit_subjects2;
        debit2["currency"] = bsdata.currency;
        debit2["debit_original"] = detail[i].debit_charge;
        debit2["credit_original"] = "";
        debit2["debit_org"] = detail[i].debit_charge;
        debit2["credit_org"] = "";
        debit2["rate_org"] = 1;
        debit2["ratetype"] = bsdata.ratetype;
        debit2["quantity"] = 0;
        debit2["secondorg"] = bsdata.pk_org;
        bodiesArr[numIndex + 1] = debit2;
        bodiesArr[numIndex + 2] = crebit;
        numIndex = numIndex + 3;
      } else {
        bodiesArr[numIndex + 1] = crebit;
        numIndex = numIndex + 2;
      }
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
    return { voucherResp: strResponse, voJson, billtypes };
  }
}
exports({ entryPoint: MyAPIHandler });