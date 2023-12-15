let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取参数 SN
    var aggData = param.data && param.data[0];
    let snArray = new Array();
    let codeArray = new Array();
    if (!aggData) {
      return {};
    }
    let func = extrequire("FA.billChange.defToAttrextBack");
    let configMap = func.execute();
    let { defineToAttrextMapping } = configMap;
    let snAttrCode = defineToAttrextMapping["define1"] || "attrext2";
    if (aggData._entityName == "fa.fixedasset.FixedAssetsInfo") {
      let SN = aggData["fixedAssetsInfoCharacter"] && aggData["fixedAssetsInfoCharacter"][snAttrCode];
      let code = aggData.code;
      if (SN) {
        snArray.push(SN);
        codeArray.push(code);
      }
    } else if (aggData._entityName == "fa.changebill.ChangeBillVO") {
      aggData.bodies &&
        aggData.bodies.forEach((item) => {
          if (item.extendDefine1 && item.extendDefine1 != "") {
            snArray.push(item.extendDefine1);
            codeArray.push(item.assetid_code);
          }
        });
    }
    if (snArray.length > 0) {
      let snInSqlCond = "('" + snArray.join("','") + "')";
      let codeInSqlCond = "('" + codeArray.join("','") + "')";
      //根据sn 获取数据库中是否有相同数据
      var yonsql =
        "select fixedAssetsInfoCharacter." +
        snAttrCode +
        ",code from fa.fixedasset.FixedAssetsInfo  where fixedAssetsInfoCharacter." +
        snAttrCode +
        " in " +
        snInSqlCond +
        " and code not in " +
        codeInSqlCond;
      var res = ObjectStore.queryByYonQL(yonsql, "yonyoufi");
      if (res && res.length > 0) {
        throw new Error("SN编码重复：" + snArray.join("','"));
      } else {
        //校验固定资产变动单中是否有重复项
        var changBillSql =
          "select code as '变动单号',details.extendDefine1 as SN,details.assetid.code as '资产编码'  from fa.changebill.ChangeBillVO left join fa.changebill.ChangeBillDetailVO details on details.changebill = id where status <> 1 and details.extendDefine1 in " +
          snInSqlCond +
          " and details.assetid.code not in " +
          codeInSqlCond;
        var changCheckRes = ObjectStore.queryByYonQL(changBillSql, "yonyoufi");
        if (changCheckRes && changCheckRes.length > 0) {
          throw new Error("SN编码重复：" + JSON.stringify(changCheckRes[0]));
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });