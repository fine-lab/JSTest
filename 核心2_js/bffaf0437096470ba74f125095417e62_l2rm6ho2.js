let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var selectrows = request.selectRows;
    var insertdata = [selectrows.length];
    for (var i = 0; i < selectrows.length; i++) {
      var applydata = selectrows[i];
      var psndochead = {};
      var id = applydata.id;
      psndochead.name = applydata.name;
      psndochead.sex = applydata.sex;
      psndochead.cerID = applydata.cerID;
      psndochead.birthday = applydata.birthday;
      psndochead.nianling = applydata.nianling;
      psndochead.zhiwei = applydata.zhiwei;
      var psndocbody = getBodyData(id);
      if (null !== psndocbody && psndocbody.length > 0) {
        var BodyData = makeBodyData(psndocbody); //组装员工主表的子表履历信息数据
        psndochead.psndocperienceinfoList = BodyData;
      }
      insertdata[i] = psndochead;
    }
    var res = ObjectStore.insertBatch("GT20075AT434.GT20075AT434.psndocpractice", insertdata, "b20ac482");
    return { result: res };
    function getBodyData(id) {
      var resbody = ObjectStore.queryByYonQL("select * from GT20075AT434.GT20075AT434.psndocperience where dr=0 and psndocperienceFk=" + id);
      return resbody;
    }
    function makeBodyData(applypsndocbody) {
      var bodydata = [applypsndocbody.length];
      for (var i = 0; i < applypsndocbody.length; i++) {
        var body = applypsndocbody[i];
        var psndocbody = {};
        psndocbody.corp = body.corp;
        psndocbody.startdate = body.startdate;
        psndocbody.enddate = body.enddate;
        psndocbody.workcontent = body.workcontent;
        bodydata[i] = psndocbody;
      }
      return bodydata;
    }
  }
}
exports({ entryPoint: MyAPIHandler });