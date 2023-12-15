let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //从前端获取到参数
    var selectRows = request.selectedRows;
    //定义数组变量长度
    var insertdata = [selectRows.length];
    for (var i = 0; i < selectRows.length; i++) {
      //遍历父表中的数据 存放到变量中
      var staff = selectRows[i];
      //定义变量 用于存放json字符串
      var psndochead = {};
      //从父表中获取关联子表的id
      var id = staff.id;
      //组装json数据
      psndochead.code = staff.code;
      psndochead.entryTime = staff.entryTime;
      //将查询到的sql存放到变量中
      var psndocbody = getBodyData(id);
      //健壮性判断
      if (psndocbody !== null || psndocbody.length < 0) {
        //调用组装子表的方法
        var BodyData = makeBodyData(psndocbody);
        psndochead.InApplicationDemo2List = BodyData;
      }
      //把json数据存放到容器中
      insertdata[i] = psndochead;
    }
    //插入员工信息数据
    var res = ObjectStore.insertBatch("GT31311AT438.GT31311AT438.StaffInformation2", insertdata, "ac67635dList");
    return { res };
    function getBodyData(id) {
      //通过sql查询出子表信息
      var resbody = ObjectStore.queryByYonQL("select * from GT31311AT438.GT31311AT438.InApplicationDemo  where dr=0 and InApplicationDemoFk=" + id);
      return resbody;
    }
    //组装子表的方法
    function makeBodyData(psndocbody) {
      //定义数组变量长度
      var bodydata = [psndocbody.length];
      for (var i = 0; i < psndocbody.length; i++) {
        //遍历子表中的数据 存放到变量中
        var body = psndocbody[i];
        //定义变量用来存放json数据
        var psndochead = {};
        //组装子表数据
        psndochead.name = body.name;
        psndochead.gender = body.gender;
        psndochead.age = body.age;
        psndochead.date = body.date;
        psndochead.remark = body.remark;
        //把json数据存放到容器中
        bodydata[i] = psndochead;
      }
      return bodydata;
    }
  }
}
exports({ entryPoint: MyAPIHandler });