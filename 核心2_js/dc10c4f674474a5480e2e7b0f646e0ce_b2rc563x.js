let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pageData = param.data[0];
    let patient_id = pageData.patient_id;
    if (pageData.id) {
      let sql = "select id from ifluxCheckv2.ifluxCheckv2.ch_checkv	 where dr=0 and  patient_id ='" + patient_id + "' and id != '" + pageData.id + "'";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        throw new Error(sql + "该患者的检验检查已存在已经存在，请重新选择");
      }
    } else {
      let sql = "select id from ifluxCheckv2.ifluxCheckv2.ch_checkv	 where dr=0 and  patient_id ='" + patient_id + "'";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        throw new Error(sql + "该患者的检验检查已存在已经存在，请重新选择");
      }
    }
    //产寻数据库进行合法性校验
    return {};
  }
}
exports({ entryPoint: MyTrigger });