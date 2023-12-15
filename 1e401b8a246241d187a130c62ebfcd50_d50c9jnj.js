let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func = extrequire("FA.billChange.defToAttrextBack");
    let res = func.execute();
    let { excelFieldSMapping, fieldSMapping } = res;
    let currUser = ObjectStore.user();
    let currUserId;
    let appContext = JSON.parse(AppContext());
    var userSql = "select * from base.user.User where yhtUserId ='" + currUser.id + "'";
    var userInfo = ObjectStore.queryByYonQL(userSql, "developplatform");
    if (userInfo && userInfo.length > 0) {
      currUserId = userInfo[0].id;
    }
    let envInfo = ObjectStore.env();
    let accentityToItems = request.accentityToItems;
    let billCodes = request.billCodes;
    let accNameToObject = new Map();
    let nameValues = Object.keys(accentityToItems);
    let nameValuesCondition = "('" + nameValues.join("','") + "')";
    //根据sn 获取数据库中是否有相同数据
    var querySql = "select * from org.func.BaseOrg where name in " + nameValuesCondition;
    var orgResult = ObjectStore.queryByYonQL(querySql, "orgcenter");
    if (orgResult && orgResult.length > 0) {
      orgResult.forEach((orgObj) => {
        accNameToObject.set(orgObj.name, orgObj);
      });
    }
    let codeToObject = new Map();
    let codesInSqlCond = "('" + billCodes.join("','") + "')";
    //根据sn 获取数据库中是否有相同数据
    var yonsql = "select *,bodies.id from fa.fixedasset.FixedAssetsInfo left join bodies where code in " + codesInSqlCond;
    var assetResult = ObjectStore.queryByYonQL(yonsql, "yonyoufi");
    if (assetResult && assetResult.length > 0) {
      assetResult.forEach((assetItem) => {
        codeToObject.set(assetItem.code, assetItem);
      });
    }
    let resultData = [];
    let nowDate = getTime();
    for (let accentityName in accentityToItems) {
      if (accNameToObject.has(accentityName)) {
        //构建一个固定资产变动单的对象
        let billChangeItem = {
          changetype_code: "22",
          changetype: "fixedassetsinfo_userdefine",
          isWfControlled: false,
          isnoweffect: true,
          _status: "Insert",
          status: 0
        };
        let accInfo = accNameToObject.get(accentityName);
        billChangeItem["accentity"] = accInfo.id;
        billChangeItem["businessdate"] = nowDate;
        billChangeItem["accentity_name"] = accInfo.name;
        billChangeItem["creator"] = currUserId;
        billChangeItem["creatorId"] = currUserId;
        //承载变动子表的数据集合
        let bodies = [];
        //遍历子实体的
        var reg = new RegExp("^[0-9]+$");
        let items = accentityToItems[accentityName];
        for (let item of items) {
          if (item.showTime) {
            if (reg.test(item.showTime)) {
              let datePar = new Date((parseInt(item.showTime) - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
              item.showTime = datePar.getFullYear() + "-" + prefixInteger(datePar.getMonth() + 1, 2) + "-" + prefixInteger(datePar.getDate(), 2);
            } else if (item.showTime.length == 8 && item.showTime.indexOf("-") == -1) {
              let showTimeDate = item.showTime.substring(0, 4) + "-" + item.showTime.substring(4, 6) + "-" + item.showTime.substring(6, 8);
              item.showTime = showTimeDate;
            }
            if (item.showTime.length == 10) {
              item.showTime += " 00:00:00";
            }
          }
          //根据code获取固定资产卡片的内容
          let faObject = codeToObject.get(item.code);
          let fixedAssetsInfoCharacter = faObject.fixedAssetsInfoCharacter;
          let body = { _status: "Insert" };
          body["assetid_code"] = faObject.code;
          body["assetid"] = faObject.id;
          body["calculateid"] = faObject.calid || faObject.bodies_id;
          body["extendCharcterId"] = fixedAssetsInfoCharacter && fixedAssetsInfoCharacter.id;
          let beUserDefs = {};
          let afUserDefs = {};
          for (let itemFieldKey in fieldSMapping) {
            //获取变动后的值即
            let atrextKey = fieldSMapping[itemFieldKey];
            let atrextValue = item[excelFieldSMapping[itemFieldKey]] || "";
            body[itemFieldKey] = atrextValue;
            //获取和设置变动前的值
            let fieldBefKey = itemFieldKey + "Bef";
            let atrextBefValue = (fixedAssetsInfoCharacter && fixedAssetsInfoCharacter[atrextKey]) || "";
            body[fieldBefKey] = atrextBefValue;
            if (atrextValue != atrextBefValue) {
              beUserDefs[atrextKey] = atrextBefValue || "";
              afUserDefs[atrextKey] = atrextValue || "";
            }
          }
          if (body["extendCharcterId"]) {
            afUserDefs.id = body["extendCharcterId"];
            beUserDefs.id = body["extendCharcterId"];
          }
          if (Object.keys(afUserDefs).length > 0) {
            body.beUserDefs = beUserDefs;
            body.afUserDefs = afUserDefs;
          }
          bodies.push(body);
        }
        billChangeItem["bodies"] = bodies;
        resultData.push(billChangeItem);
      }
    }
    let configParamsFun = extrequire("GT37522AT1.pubFunction.configParamsFun");
    let configParams = configParamsFun.execute({ envUrl: request.envUrl, appcode: "FA" }).configParams;
    let authUrl = "https://www.example.com/" + configParams.tenantId + "&ncucode=" + configParams.code;
    let apiResponse = openLinker("POST", authUrl, "FA", JSON.stringify({ data: resultData }));
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.code != "200") {
      throw new Error(apiResponse.message);
    }
    return { res: JSON.stringify({ data: resultData }), appContext };
    function getTime() {
      let now = new Date();
      let year = now.getFullYear();
      let month = ("0" + (now.getMonth() + 1)).slice(-2); // 注意，月份是从0开始的，所以需要+1
      let day = ("0" + now.getDate()).slice(-2);
      let formattedDate = year + "-" + month + "-" + day;
      return formattedDate;
    }
  }
}
exports({ entryPoint: MyAPIHandler });