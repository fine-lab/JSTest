let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let firstDate = request.firstDate;
    let sql = "select distinct code,name,toFixDetail.material.name,toFixDetail.material.code,begintime useDate ";
    sql += " from fa.fixedasset.FixedAssetsInfo left join fa.fixedasset.FixedAssetsInfoDefine de on id = de.id ";
    sql += " inner join fa.tofixedassets.ToFixedAssets toFix on sourcebillno = toFix.code ";
    sql += " inner join fa.tofixedassets.ToFixedAssetsDetail toFixDetail on toFixDetail.tofixedassets = toFix.id";
    sql += " where begintime >= '" + request.firstDate + "'";
    sql += " and de.define5 is not null ";
    let result = ObjectStore.queryByYonQL(sql, "fifa");
    let fixedassetsVo = [];
    if (!result || result.length <= 0) {
      return {};
    }
    let phymaterialCode = ""; // 物料编码
    for (var i = 0; i < result.length; i++) {
      let data = result[i];
      if (data.name == data.toFixDetail_material_name) {
        if (phymaterialCode.indexOf("'" + data.toFixDetail_material_code + "'") == -1) {
          phymaterialCode += "'" + data.toFixDetail_material_code + "',";
        }
        fixedassetsVo.push(data);
      }
    }
    phymaterialCode = phymaterialCode.substring(0, phymaterialCode.length - 1);
    // 查询物料映射表
    let suanSql =
      "select phymaterial_code materialCode,productcode suanliType,productname suanliTypeName from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable where phymaterial_code in (" +
      phymaterialCode +
      ")";
    let suanResult = ObjectStore.queryByYonQL(suanSql);
    let resultThreeMap = new Map(); // 页签三
    let dataThree = [];
    for (var j = 0; j < suanResult.length; j++) {
      for (var z = 0; z < fixedassetsVo.length; z++) {
        if (suanResult[j].materialCode == fixedassetsVo[z].toFixDetail_material_code) {
          if (resultThreeMap.has(suanResult[j].suanliType)) {
            let suanliSum = resultThreeMap.get(suanResult[j].suanliType)["suanliSum"] + 1;
            resultThreeMap.get(suanResult[j].suanliType)["suanliSum"] = suanliSum;
          } else {
            resultThreeMap.set(suanResult[j].suanliType, { suanliType: suanResult[j].suanliType, suanliTypeName: suanResult[j].suanliTypeName, suanliSum: 1, useMonth: request.month });
          }
        }
      }
    }
    resultThreeMap.forEach((value, key) => {
      dataThree.push(value);
    });
    return { dataThree: dataThree };
  }
}
exports({ entryPoint: MyAPIHandler });