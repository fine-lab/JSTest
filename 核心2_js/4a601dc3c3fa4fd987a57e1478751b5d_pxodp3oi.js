let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let id = pdata.id;
    let resData = ObjectStore.selectById("GT3734AT5.GT3734AT5.XunPanXSBill", { id: id }); //,"3199a3d6"
    //已关联潜客不能弃审
    let org_id = resData.org_id;
    let bURI = "";
    let sqlStr = "";
    if (org_id == "1573823532355289104") {
      //建机事业部AIMIX
      bURI = "GT3734AT5.GT3734AT5.GongSi_JJ";
      sqlStr = "select S.ShangJiBianMa as ShangJiBianMa from " + bURI + " inner join GT3734AT5.GT3734AT5.ShangJiXinXi_JJ S on S.GongSi_JJ_id=id where S.XunPanXXId='" + id + "'";
    } else if (org_id == "1573823532355289110") {
      //环保-百特
      bURI = "GT3734AT5.GT3734AT5.GongSi_HB";
      sqlStr = "select S.ShangJiBianMa as ShangJiBianMa from " + bURI + " inner join GT3734AT5.GT3734AT5.ShangJiXinXi_HB S on S.GongSi_HB_id=id where S.XunPanXXId='" + id + "'";
    } else {
      //游乐1573823532355289106
      bURI = "GT3734AT5.GT3734AT5.GongSi_YL";
      sqlStr = "select S.ShangJiBianMa as ShangJiBianMa from " + bURI + " inner join GT3734AT5.GT3734AT5.ShangJiXinXi_YL S on S.GongSi_YL_id=id where S.XunPanXXId='" + id + "'";
    }
    let resCount = ObjectStore.queryByYonQL(sqlStr, "developplatform");
    if (resCount.length > 0) {
      if (resData.ShangJiBianMa == undefined || resData.ShangJiBianMa == null || resData.ShangJiBianMa == "") {
        return { rst: true };
      }
      throw new Error(resCount[0].ShangJiBianMa + "线索已生成潜在客户，不能弃审!" + sqlStr);
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });