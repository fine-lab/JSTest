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
    if (!partnerList || partnerList.length <= 0) {
      partnerList = [];
      var sql =
        "select partner, partnerName, c.contact as contact,c.email as email,c.yhtUserId as yhtUserId,c.contractName as contractName from GT5258AT16.GT5258AT16.out_partner left join GT5258AT16.GT5258AT16.partner_contacts c on id = c.out_partner_id where enable ='1' and isDefault='Y' and c.isDefault='Y'";
      var links = ObjectStore.queryByYonQL(sql);
      result.links = links;
      for (var i11 = 0; i11 < links.length; i11++) {
        var link = links[i11];
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
        partnerList.push(partner1);
      }
      var ytd = { id: id, partnerList: partnerList };
      var res222 = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource", ytd, "c28d8f19");
      result.ytd = ytd;
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });