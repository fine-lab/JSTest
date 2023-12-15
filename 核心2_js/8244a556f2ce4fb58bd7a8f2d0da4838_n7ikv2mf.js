let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var partnerName = request.name;
    var partnerId = request.id;
    //从POMP查询顾问信息
    let apiResponse = postman(
      "get",
      "https://www.example.com/" + partnerName + "&token=EDTE7kPyeyuNYPbqMf0DmVY2gZFhxveRoSrr31gxsNb6cM8tUgeZhdKV3GI4fkCV",
      JSON.stringify({}),
      JSON.stringify({})
    );
    let datas = JSON.parse(apiResponse).data;
    //查询已有顾问列表
    var advisorList = ObjectStore.selectByMap("AT17E908FC08280001.AT17E908FC08280001.part_advisor_list", { partner: partnerId });
    let oldAdMap = new Map();
    let newAdMap = new Map();
    if (advisorList) {
      for (var i = 0; i < advisorList.length; i++) {
        oldAdMap.set(advisorList[i].yhtuserid, advisorList[i]);
      }
    }
    if (!datas) {
      datas = [];
    }
    let insertList = [];
    let updateList = [];
    let deleteList = [];
    for (var j = 0; j < datas.length; j++) {
      newAdMap.set(datas[j].yhtuserid, datas[j]);
      //存在则更新
      if (oldAdMap.has(datas[j].yhtuserid)) {
        let ad = oldAdMap.get(datas[j].yhtuserid);
        ad.advisorName = datas[j].name;
        ad.domian = datas[j].doname;
        ad.certlevel = datas[j].certname;
        ad.direct = datas[j].drname;
        ad.prodline = datas[j].plname;
        updateList.push(ad);
      } else {
        //新增
        let newAd = {
          advisorName: datas[j].name,
          yhtuserid: datas[j].yhtuserid,
          partnerName: partnerName,
          domian: datas[j].doname,
          certlevel: datas[j].certname,
          direct: datas[j].drname,
          prodline: datas[j].plname,
          partner: partnerId
        };
        insertList.push(newAd);
      }
    }
    if (insertList.length > 0) {
      try {
        ObjectStore.insertBatch("AT17E908FC08280001.AT17E908FC08280001.part_advisor_list", insertList, "ybf125ef2e");
      } catch (e) {}
    }
    if (updateList.length > 0) {
      try {
        ObjectStore.updateBatch("AT17E908FC08280001.AT17E908FC08280001.part_advisor_list", updateList, "ybf125ef2e");
      } catch (e) {}
    }
    return { datas, advisorList, insertList, updateList, apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });