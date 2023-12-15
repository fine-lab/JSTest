let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var docid = param.data[0].id;
    var queryobject = {
      id: docid,
      compositions: [
        {
          name: "HTSKMXList"
        }
      ]
    };
    var queryres = ObjectStore.selectById("GT57366AT51.GT57366AT51.AQTZZ", queryobject);
    var lines = queryres.HTSKMXList;
    var totalje = 0;
    if (lines != undefined) {
      for (var i = lines.length - 1; i >= 0; i--) {
        if (lines[i].shoukuanjineyuan != undefined) {
          totalje = totalje + lines[i].shoukuanjineyuan;
        }
      }
    }
    var modifyobject = {
      id: docid,
      shijishoukuanjine: totalje
    };
    var modifyres = ObjectStore.updateById("GT57366AT51.GT57366AT51.AQTZZ", modifyobject, "f5b4af18List");
    return {};
  }
}
exports({ entryPoint: MyTrigger });