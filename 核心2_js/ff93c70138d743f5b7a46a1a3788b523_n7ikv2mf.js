let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var result = {};
    //获取合同变更信息
    var bgid = request.id;
    var bgObject = {
      id: bgid,
      compositions: [
        {
          name: "HTCPFWBGList",
          compositions: []
        },
        {
          name: "HTFKTKBGList",
          compositions: []
        }
      ]
    };
    //实体查询
    var conChangeObj = ObjectStore.selectById("GT27606AT15.GT27606AT15.HBHTGLBG", bgObject);
    //查询合同信息
    var htObject = {
      id: conChangeObj.source_id,
      compositions: [
        {
          name: "HTCPFWList",
          compositions: []
        },
        {
          name: "HTFKTKList",
          compositions: []
        }
      ]
    };
    //实体查询
    var conObj = ObjectStore.selectById("GT27606AT15.GT27606AT15.HBHTGL", htObject);
    result.conChangeObj = conChangeObj;
    result.conObj = conObj;
    //最新
    if (conChangeObj.lastflag === "1") {
      var HTCPFWListBody = [];
      var HTFKTKListBody = [];
      //组织表体信息
      var HTCPFWList = conObj.HTCPFWList;
      if (HTCPFWList !== null && HTCPFWList !== undefined) {
        for (var num1 = 0; num1 < HTCPFWList.length; num1++) {
          HTCPFWListBody.push({ id: HTCPFWList[num1].id, _status: "Delete" });
        }
      }
      var HTFKTKList = conObj.HTFKTKList;
      if (HTFKTKList !== null && HTFKTKList !== undefined) {
        for (var num2 = 0; num2 < HTFKTKList.length; num2++) {
          HTFKTKListBody.push({ id: HTFKTKList[num2].id, _status: "Delete" });
        }
      }
      var HTCPFWBGList = conChangeObj.HTCPFWBGList;
      if (HTCPFWBGList !== null && HTCPFWBGList !== undefined) {
        for (var num3 = 0; num3 < HTCPFWBGList.length; num3++) {
          var body = HTCPFWBGList[num3];
          delete body.id;
          body._status = "Insert";
          HTCPFWListBody.push(body);
        }
      }
      var HTFKTKBGList = conChangeObj.HTFKTKBGList;
      if (HTFKTKBGList !== null && HTFKTKBGList !== undefined) {
        for (var num4 = 0; num4 < HTFKTKBGList.length; num4++) {
          var body2 = HTFKTKBGList[num4];
          delete body2.id;
          body2._status = "Insert";
          HTFKTKListBody.push(body2);
        }
      }
      //表头信息
      var contractHead = {
        id: conChangeObj.source_id,
        hetongbianhao: conChangeObj.hetongbianhao,
        hetongmingchen: conChangeObj.hetongmingchen,
        kehumingchen: conChangeObj.kehumingchen,
        qianyueriqi: conChangeObj.qianyueriqi,
        yonyouOrg: conChangeObj.yonyouOrg,
        yonyouOrgName: conChangeObj.yonyouOrgName,
        yonyouOrgCode: conChangeObj.yonyouOrgCode,
        associateOrg: conChangeObj.associateOrg,
        huobanxiaoshoujingli: conChangeObj.huobanxiaoshoujingli,
        shifuxunihetong: conChangeObj.shifuxunihetong,
        hetongjine: conChangeObj.hetongjine,
        bizhong: conChangeObj.bizhong,
        huilv1: conChangeObj.huilv1,
        zhibaojin: conChangeObj.zhibaojin,
        hetongfujian: conChangeObj.hetongfujian,
        beizhu: conChangeObj.beizhu,
        hetongzhuangtai: conChangeObj.hetongzhuangtai,
        zhongzhiyuanyin: conChangeObj.zhongzhiyuanyin,
        zhongzhiriqi: conChangeObj.zhongzhiriqi,
        coordinate_apply_code: conChangeObj.coordinate_apply_code,
        versionNum: conChangeObj.versionNum,
        changeStatus: "3",
        HTCPFWList: HTCPFWListBody,
        HTFKTKList: HTFKTKListBody
      };
      result.contractHead = contractHead;
      var updateRes = ObjectStore.updateById("GT27606AT15.GT27606AT15.HBHTGL", contractHead);
      result.updateRes = updateRes;
    }
    //根据
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });