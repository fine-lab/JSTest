let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var userId = request.userId;
    var partnerName = request.partnerName;
    var authProdLine = "";
    var authBusiType = "";
    var authCertList = [];
    let QueryPartnerDetail = extrequire("GT30659AT3.POMPInterface.QueryPartnerDetail");
    let partnerObj = QueryPartnerDetail.execute({ userId, partnerName });
    let partner = partnerObj; //JSON.parse(partnerObj);
    if (partner.data && partner.data.data && partner.data.data.prmPartnerCertVOList) {
      let certVOList = partner.data.data.prmPartnerCertVOList;
      for (var num11 = 0; num11 < certVOList.length; num11++) {
        let endDate = new Date(certVOList[num11].endDate.substring(0, 10));
        if (endDate > new Date()) {
          let certVO = {
            startDate: certVOList[num11].startDate,
            endDate: certVOList[num11].endDate,
            authProdLine: certVOList[num11].authProductLineNames,
            authBusiType: certVOList[num11].authBusiTypeNames
          };
          authCertList.push(certVO);
        }
      }
    }
    return { authCertList };
  }
}
exports({ entryPoint: MyAPIHandler });