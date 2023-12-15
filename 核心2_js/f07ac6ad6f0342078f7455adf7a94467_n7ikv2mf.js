let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var level = request.level;
    var result = {};
    var newPartnerList = [];
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
    var partnerIds = [];
    if (partnerList) {
      for (var i12 = 0; i12 < partnerList.length; i12++) {
        partnerIds.push(partnerList[i12].partner);
      }
    }
    var sql =
      "select partner, partnerName, c.contact as contact,c.email as email,c.yhtUserId as yhtUserId,c.contractName as contractName from GT5258AT16.GT5258AT16.out_partner left join GT5258AT16.GT5258AT16.partner_contacts c on id = c.out_partner_id where dr=0 and partnerLevel='" +
      level +
      "' and enable ='1' and c.dr=0 and c.isDefault='Y'";
    if (level == "00501") {
      sql += " and isDefault='Y'";
    }
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
    if (newPartnerList.length > 0) {
      var ytd = { id: id, partnerList: newPartnerList };
      var res222 = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource", ytd, "c28d8f19");
      result.ytd = ytd;
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });