let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let updateSubList = [];
    let tempList = [];
    if (request) {
      let param = JSON.parse(request.childData);
      //查询内容
      var object = {
        bianma: "A0001",
        compositions: [
          {
            name: "ZBGLZBList"
          }
        ]
      };
      //实体查询
      let res = ObjectStore.selectByMap("AT1957625017480008.AT1957625017480008.CCYWGLSJ", object);
      if (!res[0].ZBGLZBList) {
        res[0].ZBGLZBList = [];
      }
      // 组装数据
      param[0].ZBGLZBList.forEach(function (childiteam) {
        childiteam._status = "Insert";
      });
      if (res[0].ZBGLZBList && res[0].ZBGLZBList.length > 0) {
        for (var i = 0; i < res[0].ZBGLZBList.length; i++) {
          if (res[0].ZBGLZBList[i].orgid == param[0].startorg) {
            res[0].ZBGLZBList[i]._status = "Delete";
          } else {
            res[0].ZBGLZBList[i]._status = "Insert";
          }
          updateSubList.push(res[0].ZBGLZBList[i]);
        }
      }
      if (param[0].ZBGLZBList && param[0].ZBGLZBList.length > 0) {
        param[0].ZBGLZBList.forEach(function (childiteam) {
          childiteam._status = "Insert";
          updateSubList.push(childiteam);
        });
      }
      res[0]._status = "Update";
      res[0].ZBGLZBList = updateSubList;
      // 删除数据
      ObjectStore.deleteById("AT1957625017480008.AT1957625017480008.CCYWGLSJ", res, "CCYWGLSJ");
      for (i = 0; i < res[0].ZBGLZBList.length; i++) {
        if (res[0].ZBGLZBList[i]._status == "Insert") {
          tempList.push(res[0].ZBGLZBList[i]);
        }
      }
      res[0].ZBGLZBList = tempList;
      res = ObjectStore.insertBatch("AT1957625017480008.AT1957625017480008.CCYWGLSJ", res, "CCYWGLSJ");
      return { res };
    }
  }
}
exports({ entryPoint: MyAPIHandler });