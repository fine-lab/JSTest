let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var platform = request.platform;
    var result = {};
    //根据预提单id获取预提单详情
    var object = {
      id: id,
      compositions: [
        {
          name: "apply_partner_detailList"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT5258AT16.GT5258AT16.apply_outs_resource_prl", object);
    var partnerList = res.apply_partner_detailList;
    if (!partnerList || partnerList.length <= 0) {
      partnerList = [];
      var sql =
        "select id,partner, partnerName, c.contact as contact,c.email as email,c.yhtUserId as yhtUserId,c.contractName as contractName from GT5258AT16.GT5258AT16.out_partner_prl left join GT5258AT16.GT5258AT16.partner_contacts_prl c on id = c.out_partner_prl_id where dr=0 and enable ='1' and isDefault='Y' and c.dr=0 and c.platform='" +
        platform +
        "'";
      var links = ObjectStore.queryByYonQL(sql);
      result.links = links;
      for (var i11 = 0; i11 < links.length; i11++) {
        var link = links[i11];
        var partner1 = {
          responseStatus: "1",
          hasDefaultInit: true,
          _tableDisplayOutlineAll: false,
          partnerDoc: link.id,
          partnerDoc_partner_name: link.partnerName,
          linkMan_name: link.contractName,
          linkMan: link.contact,
          linkManName: link.contractName,
          yhtUserid: link.yhtUserId,
          partner: link.partner,
          partner_name: link.partnerName,
          partnerName: link.partnerName,
          isPublic: "N",
          _status: "Insert"
        };
        partnerList.push(partner1);
      }
      var ytd = { id: id, apply_partner_detailList: partnerList };
      var res222 = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource_prl", ytd, "9053a2cc");
      result.ytd = ytd;
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });