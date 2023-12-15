let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获得当前页面上有的参数
    let pageData = param.data[0];
    let doctor_id = pageData.doctor_id;
    let patient_id = pageData.patient_id;
    if (pageData.id) {
      let sql = "select * from ifluxBaseDoc.ifluxBaseDoc.bd_docpatrelv1_2 where dr=0 and doctor_id = '" + doctor_id + "' and patient_id = '" + patient_id + "' and id!='" + pageData.id + "'";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        throw new Error(pageData.doctor_id_name + "与" + pageData.patient_id_name + "的组合已经存在，请重新选择");
      }
    } else {
      //产寻数据库进行合法性校验
      let sql = "select * from ifluxBaseDoc.ifluxBaseDoc.bd_docpatrelv1_2 where dr=0 and  doctor_id = '" + doctor_id + "' and patient_id = '" + patient_id + "'";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        throw new Error(pageData.doctor_id_name + "与" + pageData.patient_id_name + "的组合已经存在，请重新选择");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });