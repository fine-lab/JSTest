//调用后端函数test1
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });
//测试的预置函数
//批量插入实体字段
var object = [{ key: "yourkeyHere", subTable: [{ key: "yourkeyHere" }] }];
var res = ObjectStore.insertBatch("AT17631B1817B80009.AT17631B1817B80009.sales_dailyson", object, "sales_dailytest2");
//下推业务流
let billnum = "buillnum";
let runleid = "youridHere";
let ids = ["id1", "id2"];
let result = busWorkFlowPush(billnum, runleid, ids);