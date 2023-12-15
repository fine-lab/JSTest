let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let id = data[0].customerbillno;
    let customerCode = data[0].customerbillno_code;
    let customerName = data[0].customername;
    let orgId = data[0].org_id;
    let applyDate = data[0].applydate;
    let applier = data[0].applier;
    let applyDep = data[0].applydep;
    let code = data[0].code;
    let url = "https://www.example.com/" + id + "&orgId=" + orgId; //查询供应商档案列表
    let body = {};
    let getProDetail = openLinker("GET", url, "GZTBDM", JSON.stringify(body));
    let getProDetailObj = JSON.parse(getProDetail);
    let proDetailData = getProDetailObj.data;
    let savsUrl =
      "https://www.example.com/" +
      proDetailData.unitUseType +
      "&code=" +
      customerCode +
      "&name=" +
      customerName +
      "&manageClass_Code=" +
      proDetailData.manageClass_Code;
    let saveBody = {
      realProductAttribute: proDetailData.realProductAttribute,
      unitUseType: proDetailData.unitUseType
    };
    let saveProDetail = openLinker("POST", savsUrl, "GZTBDM", JSON.stringify(saveBody));
    return { saveProDetail };
  }
}
exports({ entryPoint: MyTrigger });