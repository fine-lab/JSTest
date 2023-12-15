let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var object = {
      id: id,
      compositions: [
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
    var cProject = ObjectStore.selectById("GT27606AT15.GT27606AT15.HBZXM", object);
    var changeObj = cProject;
    changeObj.XMJDGLBGList = cProject.XMJDGLList;
    changeObj.JXJHBGList = cProject.JXJHList;
    changeObj.XMCYGLBGList = cProject.XMCYGLList;
    changeObj.source_id = cProject.id;
    changeObj.versionNum = "0";
    changeObj.lastflag = "1";
    delete changeObj.id;
    delete changeObj.XMJDGLList;
    delete changeObj.JXJHList;
    delete changeObj.XMCYGLList;
    if (changeObj.XMJDGLList !== null && changeObj.XMJDGLList !== undefined) {
      for (var num2 = 0; num2 < changeObj.XMJDGLList.length; num2++) {
        delete changeObj.XMJDGLList[num2].id;
      }
    }
    if (changeObj.JXJHList !== null && changeObj.JXJHList !== undefined) {
      for (var num3 = 0; num3 < changeObj.JXJHList.length; num3++) {
        delete changeObj.JXJHList[num3].id;
      }
    }
    if (changeObj.XMCYGLList !== null && changeObj.XMCYGLList !== undefined) {
      for (var num4 = 0; num4 < changeObj.XMCYGLList.length; num4++) {
        delete changeObj.XMCYGLList[num4].id;
      }
    }
    var res = ObjectStore.insert("GT27606AT15.GT27606AT15.HBZXMBG", changeObj, "2961a5ab");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });