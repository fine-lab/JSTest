let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    if (param.billnum == "ef326829List") {
      //人员证照
      let orgId = data.org_id;
      let supplierCode = data.supplierName;
      let type = "授权委托书范围";
      let requst = { orgId: orgId, supplierCode: supplierCode, type: type };
      let res = extrequire("ISY_2.public.getperInfo").execute(requst).object;
      let sqwtsChildRes = res.sqwtsChildRes;
      if (sqwtsChildRes.length > 0) {
        for (let i = 0; i < sqwtsChildRes.length; i++) {
          if (sqwtsChildRes[i].authorizerCode == data.id) {
            throw new Error("编码为：" + JSON.parse(param.requestData).code + "的放行方案已被预审单引用，无法删除");
            break;
          }
        }
      }
    } else if (param.billnum == "235c68b8List") {
      //供应商资质证照
      let orgId = data.org_id;
      let supplierCode = data.supplierCode;
      let requst = { orgId: orgId, supplierCode: supplierCode, type: "证照范围" };
      let res = extrequire("ISY_2.public.getperInfo").execute(requst).object;
      let licenceChildList = res.licenceChildRes;
      if (licenceChildList.length > 0) {
        for (let i = 0; i < licenceChildList.length; i++) {
          if (licenceChildList[i].licenseName == data.id) {
            throw new Error("单据编码为：" + data.code + "的证照已被预审单引用，无法删除");
            break;
          }
        }
      }
    } else if (param.billnum == "051733faList") {
      //放行项目
      let res = extrequire("ISY_2.public.getRelePlanItems").execute();
      let releItemsRes = res.releItemsRes;
      if (releItemsRes.length > 0) {
        for (let i = 0; i < releItemsRes.length; i++) {
          if (releItemsRes[i].releaseCode == data.id) {
            throw new Error("单据编码为：" + data.code + "的放行项目已被放行方案表引用，无法删除", "error");
            break;
          }
        }
      }
    }
    throw new Error(JSON.stringify(123));
    return {};
  }
}
exports({ entryPoint: MyTrigger });