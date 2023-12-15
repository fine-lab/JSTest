let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var transfer_after_jt = param.data[0].transfer_after_jt; //集体股剩余数量
    var transfer_after_pjt = param.data[0].transfer_after_pjt; //集体股占比
    var transfer_after_cy = param.data[0].transfer_after_cy; //个人股剩余数量
    var transfer_after_pcy = param.data[0].transfer_after_pcy; //个人股占比
    var stock_transfer_dtdList = param.data[0].stock_transfer_dtdList; //子表信息
    var villager_base_MT = "villager_base_MT"; //村民id
    var village_house = "village_house"; //股权表id
    var stock_transfer_dtdList_str = "stock_transfer_dtdList"; //子表实体名前缀
    var remaining_stock = "remaining_stock"; //子表分配后股份
    var village = param.data[0].village; //村id
    var village_MT = "GT6641AT24.GT6641AT24.village_MT"; //村表名
    var stock_collective = "stock_collective"; //村集体股
    var stock_collective_p = "stock_collective_p"; //村集体股占比
    var stock_member = "stock_member"; //村个人股
    var stock_member_p = "stock_member_p"; //村个人股占比
    var personstock = "GT6641AT24.GT6641AT24.village_house_MT";
    var member_stock = "member_stock"; //人员持有股份
    var villager_base_MT = "villager_base_MT"; //人员村民id
    var objs = [];
    for (let i in stock_transfer_dtdList) {
      var childtable = stock_transfer_dtdList[i];
      var rootid = childtable.village_house;
      var id = childtable.house_member;
      var member_stock = childtable[remaining_stock];
      var obj = { id: id, member_stock: member_stock, _status: "Update" };
      if (member_stock !== undefined) {
        objs.push(obj);
      }
    }
    var vhost = stock_transfer_dtdList[0].village_house;
    var objss = { id: vhost, house_memberList: objs, _status: "Update" };
    let ss = ObjectStore.updateById(personstock, objss, "0a5e12da");
    var villagepoj = {
      _status: "Update",
      id: village, //村id
      stock_collective: transfer_after_jt, //集体股剩余数量
      stock_collective_p: transfer_after_pjt, //集体股占比
      stock_member: transfer_after_cy, //个人股剩余数量
      stock_member_p: transfer_after_pcy //个人股占比
    };
    let ss1 = ObjectStore.updateById(village_MT, villagepoj, "966f5801");
    return {};
  }
}
exports({ entryPoint: MyTrigger });