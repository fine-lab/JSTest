let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var result = {};
    //根据预提单id获取预提单详情
    var object = {
      id: id,
      compositions: [
        {
          name: "partnerList"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT5258AT16.GT5258AT16.apply_outs_resource", object);
    var partnerList = res.partnerList;
    var prductPlatform = res.prductPlatform;
    var prductPlatforms = prductPlatform.split(",");
    var hasMobile = false;
    if (prductPlatforms.includes("5")) {
      hasMobile = true;
    }
    var partnerIds = [];
    if (partnerList) {
      for (var i12 = 0; i12 < partnerList.length; i12++) {
        partnerIds.push(partnerList[i12].partner);
      }
    }
    var newPartnerList = [];
    //补偿机制，防止前端新增的时候没有自动带出
    if (!partnerList || partnerList.length <= 0) {
      var sql =
        "select partner, partnerName, c.contact as contact,c.email as email,c.yhtUserId as yhtUserId,c.contractName as contractName from GT5258AT16.GT5258AT16.out_partner left join GT5258AT16.GT5258AT16.partner_contacts c on id = c.out_partner_id where dr=0 and partnerLevel='00501' and enable ='1' and isDefault='Y' and c.dr=0 and c.isDefault='Y'";
      var links = ObjectStore.queryByYonQL(sql);
      result.links = links;
      for (var i11 = 0; i11 < links.length; i11++) {
        var link = links[i11];
        if (!partnerIds.includes(link.partner)) {
          var partner1 = {
            responseStatus: "1",
            hasDefaultInit: true,
            _tableDisplayOutlineAll: false,
            linkMan_name: link.contractName,
            linkMan: link.contact,
            linkManName: link.contractName,
            linkManEmail: link.email,
            yhtUserid: link.yhtUserId,
            partner: link.partner,
            partner_name: link.partnerName,
            partnerName: link.partnerName,
            isPublic: "N",
            _status: "Insert"
          };
          newPartnerList.push(partner1);
        }
      }
    }
    if (hasMobile && !partnerIds.includes("1888732279492864")) {
      var partner2 = {
        responseStatus: "1",
        hasDefaultInit: true,
        _tableDisplayOutlineAll: false,
        linkMan_name: "郝凤尚",
        linkMan: "2544630674232320",
        linkManName: "郝凤尚",
        linkManEmail: "https://www.example.com/",
        yhtUserid: "youridHere",
        partner: "1888732279492864",
        partner_name: "YonYou-BIP技术与产品研发中心",
        partnerName: "YonYou-BIP技术与产品研发中心",
        isPublic: "N",
        _status: "Insert"
      };
      newPartnerList.push(partner2);
    }
    if (newPartnerList.length > 0) {
      var ytd = { id: id, partnerList: newPartnerList };
      var res222 = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource", ytd, "c28d8f19");
      result.ytd = ytd;
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });