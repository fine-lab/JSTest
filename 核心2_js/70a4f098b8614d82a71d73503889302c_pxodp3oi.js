let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let id = pdata.id;
    if (true) {
      throw new Error("线索已生成潜在客户，不能弃审!");
      return;
    }
    let resData = ObjectStore.selectById("GT3734AT5.GT3734AT5.XunPanXSBill", { id: id }); //,"3199a3d6"
    //已关联潜客不能弃审
    let org_id = resData.org_id;
    let bURI = "";
    let sqlStr = "";
    if (org_id == "1573823532355289104") {
      //建机事业部AIMIX
      bURI = "GT3734AT5.GT3734AT5.GongSi_JJ";
      sqlStr = "select count(1) as relateNum from " + bURI + " inner join GT3734AT5.GT3734AT5.ShangJiXinXi_JJ S on S.GongSi_JJ_id=id where S.XunPanXXId='" + id + "'";
    } else if (org_id == "1573823532355289110") {
      //环保-百特
      bURI = "GT3734AT5.GT3734AT5.GongSi_HB";
      sqlStr = "select count(1) as relateNum from " + bURI + " inner join GT3734AT5.GT3734AT5.ShangJiXinXi_HB S on S.GongSi_HB_id=id where S.XunPanXXId='" + id + "'";
    } else {
      //游乐1573823532355289106
      bURI = "GT3734AT5.GT3734AT5.GongSi_YL";
      sqlStr = "select count(1) as relateNum from " + bURI + " inner join GT3734AT5.GT3734AT5.ShangJiXinXi_YL S on S.GongSi_YL_id=id where S.XunPanXXId='" + id + "'";
    }
    let resCount = ObjectStore.queryByYonQL(sqlStr, "developplatform");
    if (resCount[0].relateNum > 0) {
      throw new Error("线索已生成潜在客户，不能弃审!");
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });