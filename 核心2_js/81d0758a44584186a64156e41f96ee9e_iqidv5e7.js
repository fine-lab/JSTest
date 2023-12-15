let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var term = request.request;
    var arr = term.split("&");
    //考核方案主键
    var assessment_plan = arr[0];
    //被考核人主键
    var appraisers = arr[1];
    //考核指标主键
    var assessment_index = arr[2];
    //查询的时间作为条件会报非法时间
    var idsql =
      "select id,assessment_method,pubts from AT161E0CE809D00004.AT161E0CE809D00004.appraiseeselection " +
      "where assessment_plan = '" +
      assessment_plan +
      "' and appraisers = '" +
      appraisers +
      "' and assessment_index = '" +
      assessment_index +
      "' and dr=0 order by pubts desc";
    var idquer = ObjectStore.queryByYonQL(idsql, "developplatform");
    if (idquer !== null) {
      var id = idquer[0].id;
      var assessment_method = idquer[0].assessment_method;
      var sonsql = "select * from AT161E0CE809D00004.AT161E0CE809D00004.appraiseeselection_son where appraiseeselection_id = '" + id + "' and dr=0";
      var sonquer = ObjectStore.queryByYonQL(sonsql, "developplatform");
      var array = [];
      for (let i = 0; i < sonquer.length; i++) {
        var appraiseeselection_son_id = sonquer[i].id;
        var sunsql = "select * from AT161E0CE809D00004.AT161E0CE809D00004.appraiseeselection_sun " + "where appraiseeselection_son_id = '" + appraiseeselection_son_id + "' and dr = 0";
        var sunquer = ObjectStore.queryByYonQL(sunsql, "developplatform");
        array.push(sunquer);
      }
    } else {
      var quer = null;
    }
    return {
      data: sonquer,
      sunquer: array,
      assessment_method: assessment_method
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});