let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取保存的数据
    var data = param.data;
    if (data.length > 0) {
      for (var i = data.length - 1; i >= 0; i--) {
        var ChildtableListData = data[i].ChildtableList;
        if (ChildtableListData != null) {
          if (ChildtableListData.length > 0) {
            for (var j = ChildtableListData.length - 1; j >= 0; j--) {
              // 获取任务单号
              let TasklistNum = ChildtableListData[j].TasklistNum;
              // 修改任务单
              var object = { id: TasklistNum, isQuote: "是" };
              var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.changethecontract", object, "70e7b0f7");
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });