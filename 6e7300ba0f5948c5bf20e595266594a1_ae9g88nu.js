let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let mainId = request.mainId; //人员id或者供应商资质证照id
    let synType = request.synType; //同步数据类型 1--同步人员  2--同步供应商资质证照
    let delObj = {}; //删除条件
    let delTableUrl = ""; //删除表url
    let delTableCode = ""; //删除表编码
    let queryObj = {}; //查询人员或供应商资质证照子表参数
    let queryUrl = ""; //查询人员或供应商资质证照子表url
    if (synType == 1) {
      //根据人员id查询合格供应商授权人子表
      let paramObj = { authorizerCode: mainId };
      let childList = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_attorney", paramObj);
      queryObj = { SY01_personal_licensen_id: mainId };
      queryUrl = "ISY_2.ISY_2.SY01_personal_licensen_child";
      for (let j = 0; j < childList.length; j++) {
        let sunList = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_attorney_range", { SY01_supply_attorney_id: childList[j].id });
        delTableUrl = "ISY_2.ISY_2.SY01_supply_attorney_range";
        delTableCode = "SY01_supply_attorney_range";
        for (let i = 0; i < sunList.length; i++) {
          delObj = { id: sunList[i].id };
          let res = ObjectStore.deleteById(delTableUrl, delObj, delTableCode);
        }
        let personChildList = ObjectStore.selectByMap(queryUrl, queryObj);
        for (let i = 0; i < personChildList.length; i++) {
          let sunInsertList = ObjectStore.queryByYonQL(
            "select authProductType ,authProduct, authDosageForm, authSku " +
              "," +
              childList[j].id +
              " SY01_supply_attorney_id," +
              personChildList[i].authType +
              " authType from ISY_2.ISY_2.SY01_personal_licensen_sun where SY01_personal_licensen_child_id =" +
              personChildList[i].id
          );
          let insertNum = ObjectStore.insertBatch("ISY_2.ISY_2.SY01_supply_attorney_range", sunInsertList, "SY01_supply_attorney_range");
        }
      }
    } else {
      //根据供应商资质证照id查询合格供应商证照子表
      let paramObj = { licenseId: mainId };
      let childList = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_licences", paramObj);
      queryObj = { SY01_supply_qualify_licence_id: mainId };
      queryUrl = "ISY_2.ISY_2.SY01_supply_licence_child";
      for (let j = 0; j < childList.length; j++) {
        let sunList = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_licences_range", { SY01_supply_licences_id: childList[j].id });
        delTableUrl = "ISY_2.ISY_2.SY01_supply_licences_range";
        delTableCode = "SY01_supply_licences_range";
        for (let i = 0; i < sunList.length; i++) {
          delObj = { id: sunList[i].id };
          let res = ObjectStore.deleteById(delTableUrl, delObj, delTableCode);
        }
        let personChildList = ObjectStore.selectByMap(queryUrl, queryObj);
        for (let i = 0; i < personChildList.length; i++) {
          let sunInsertList = ObjectStore.queryByYonQL(
            "select authProductType ,authProduct, authDosageForm, authSku " +
              "," +
              childList[j].id +
              " SY01_supply_licences_id," +
              personChildList[i].authType +
              " authType from ISY_2.ISY_2.SY01_supply_licence_sun where SY01_supply_licence_child_id =" +
              personChildList[i].id
          );
          let insertNum = ObjectStore.insertBatch("ISY_2.ISY_2.SY01_supply_licences_range", sunInsertList, "SY01_supply_licences_range");
        }
      }
    }
    //同步先根据条件删除合格供应商授权范围原有数据 再重新插入
    return { code: "200" };
  }
}
exports({ entryPoint: MyAPIHandler });