let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var result = {};
    //获取子项目变更信息
    var bgid = request.id;
    var bgObject = {
      id: bgid,
      compositions: [
        {
          name: "ZXMPJBGList", //子项目评价
          compositions: []
        },
        {
          name: "XMJDGLBGList", //执行计划
          compositions: []
        },
        {
          name: "JXJHBGList", //基线计划
          compositions: []
        },
        {
          name: "XMCYGLBGList", //项目成员管理
          compositions: []
        }
      ]
    };
    //实体查询
    var proChangeObj = ObjectStore.selectById("GT27606AT15.GT27606AT15.HBZXMBG", bgObject);
    //查询子项目信息
    var proObject = {
      id: proChangeObj.source_id,
      compositions: [
        {
          name: "ZXMPJList", //子项目评价
          compositions: []
        },
        {
          name: "XMJDGLList", //执行计划
          compositions: []
        },
        {
          name: "JXJHList", //基线计划
          compositions: []
        },
        {
          name: "XMCYGLList", //项目成员管理
          compositions: []
        }
      ]
    };
    //实体查询
    var proObj = ObjectStore.selectById("GT27606AT15.GT27606AT15.HBZXM", proObject);
    result.proChangeObj = proChangeObj;
    result.proObj = proObj;
    //最新
    if (proChangeObj.lastflag === "1") {
      var ZXMPJListBody = [];
      var XMJDGLListBody = [];
      var JXJHListBody = [];
      var XMCYGLListBody = [];
      //组织表体信息
      var XMJDGLList = proObj.XMJDGLList;
      if (XMJDGLList !== null && XMJDGLList !== undefined) {
        for (var num2 = 0; num2 < XMJDGLList.length; num2++) {
          XMJDGLListBody.push({ id: XMJDGLList[num2].id, _status: "Delete" });
        }
      }
      var JXJHList = proObj.JXJHList;
      if (JXJHList !== null && JXJHList !== undefined) {
        for (var num3 = 0; num3 < JXJHList.length; num3++) {
          JXJHListBody.push({ id: JXJHList[num3].id, _status: "Delete" });
        }
      }
      var XMCYGLList = proObj.XMCYGLList;
      if (XMCYGLList !== null && XMCYGLList !== undefined) {
        for (var num4 = 0; num4 < XMCYGLList.length; num4++) {
          XMCYGLListBody.push({ id: XMCYGLList[num4].id, _status: "Delete" });
        }
      }
      var XMJDGLBGList = proChangeObj.XMJDGLBGList;
      if (XMJDGLBGList !== null && XMJDGLBGList !== undefined) {
        for (var num6 = 0; num6 < XMJDGLBGList.length; num6++) {
          var body2 = XMJDGLBGList[num6];
          delete body2.id;
          body2._status = "Insert";
          XMJDGLListBody.push(body2);
        }
      }
      var JXJHBGList = proChangeObj.JXJHBGList;
      if (JXJHBGList !== null && JXJHBGList !== undefined) {
        for (var num7 = 0; num7 < JXJHBGList.length; num7++) {
          var body3 = JXJHBGList[num7];
          delete body3.id;
          body3._status = "Insert";
          JXJHListBody.push(body3);
        }
      }
      var XMCYGLBGList = proChangeObj.XMCYGLBGList;
      if (XMCYGLBGList !== null && XMCYGLBGList !== undefined) {
        for (var num8 = 0; num8 < XMCYGLBGList.length; num8++) {
          var body4 = XMCYGLBGList[num8];
          delete body4.id;
          body4._status = "Insert";
          XMCYGLListBody.push(body4);
        }
      }
      //表头信息
      var cProjectHead = {
        id: proChangeObj.source_id,
        zhuxiangmumingchen: proChangeObj.zhuxiangmumingchen,
        zixiangmumingchen: proChangeObj.zixiangmumingchen,
        zixiangmubianma: proChangeObj.zixiangmubianma,
        zixiangmu: proChangeObj.zixiangmu,
        zixiangmujingli: proChangeObj.zixiangmujingli,
        zixiangmujine: proChangeObj.zixiangmujine,
        xiangmushishifangfalun: proChangeObj.xiangmushishifangfalun,
        shifuyipingjia: proChangeObj.shifuyipingjia,
        zongtipingjiaxingji: proChangeObj.zongtipingjiaxingji,
        versionNum: proChangeObj.versionNum,
        changeStatus: "3",
        XMJDGLList: XMJDGLListBody,
        JXJHList: JXJHListBody,
        XMCYGLList: XMCYGLListBody
      };
      result.cProjectHead = cProjectHead;
      var updateRes = ObjectStore.updateById("GT27606AT15.GT27606AT15.HBZXM", cProjectHead);
      result.updateRes = updateRes;
    }
    //根据
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });