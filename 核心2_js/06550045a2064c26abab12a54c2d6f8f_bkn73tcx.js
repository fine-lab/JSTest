let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let huijiqijian = request.huijiqijian;
    let projectVO = request.projectVO;
    let sql = "";
    if (projectVO) {
      sql =
        "select *," +
        // 项目预算-修订-服务-new
        " (select * from projectbudgetreviseservicenewsList ) projectbudgetreviseservicenewsList," +
        // 项目预算-执行-耗材-new
        " (select * from projectbudgetimplementconsnewsList ) projectbudgetimplementconsnewsList," +
        // 项目预算-初始-劳务-new
        " (select * from projectbudgetinitiallabournewsList ) projectbudgetinitiallabournewsList," +
        // 项目预算-执行-劳务-new
        " (select * from projectbudgetimplemenlabournewsList ) projectbudgetimplemenlabournewsList," +
        // 项目预算-修订-耗材-new
        " (select * from projectbudget_revise_consnewsList ) projectbudget_revise_consnewsList," +
        //项目预算-初始-运输-new
        " (select * from projectbudget_initial_trannewsList ) projectbudget_initial_trannewsList," +
        //项目预算-修订累计-服务-new
        " (select * from projectbudgetrevisioservicenewsList ) projectbudgetrevisioservicenewsList," +
        //项目预算-修订-劳务-new
        " (select * from projectbudget_revise_labournewsList ) projectbudget_revise_labournewsList," +
        //项目预算-修订累计-运输-new
        " (select * from projectbudget_revision_trannewsList ) projectbudget_revision_trannewsList," +
        //项目预算-执行-服务-new
        " (select * from projectbudgetimplemeservicenewsList ) projectbudgetimplemeservicenewsList," +
        //项目预算-修订-运输-new
        " (select * from projectbudget_revise_trannewsList ) projectbudget_revise_trannewsList," +
        //项目预算-初始-耗材-new
        " (select * from projectbudgetinitialconsnewsList ) projectbudgetinitialconsnewsList," +
        //项目预算-执行-运输-new
        " (select * from projectbudgetimplementtrannewsList ) projectbudgetimplementtrannewsList," +
        // 项目预算-修订累计-劳务-new
        " (select * from projectbudgetrevisionlabournewsList ) projectbudgetrevisionlabournewsList," +
        //项目预算-修订累计-耗材-new
        " (select * from projectbudgetrevisionconssList ) projectbudgetrevisionconssList," +
        //项目预算-初始-服务-new
        " (select * from projectbudgetinitialservicenewsList ) projectbudgetinitialservicenewsList" +
        " from GT99994AT1.GT99994AT1.projectbudget_new where dr=0 and project='" +
        projectVO +
        "'and huijiqijian leftlike '" +
        substring(huijiqijian, 0, 7) +
        "'"; // 荣骏项目预算
    } else {
      sql =
        "select *," +
        // 项目预算-修订-服务-new
        " (select * from projectbudgetreviseservicenewsList ) projectbudgetreviseservicenewsList," +
        // 项目预算-执行-耗材-new
        " (select * from projectbudgetimplementconsnewsList ) projectbudgetimplementconsnewsList," +
        // 项目预算-初始-劳务-new
        " (select * from projectbudgetinitiallabournewsList ) projectbudgetinitiallabournewsList," +
        // 项目预算-执行-劳务-new
        " (select * from projectbudgetimplemenlabournewsList ) projectbudgetimplemenlabournewsList," +
        // 项目预算-修订-耗材-new
        " (select * from projectbudget_revise_consnewsList ) projectbudget_revise_consnewsList," +
        //项目预算-初始-运输-new
        " (select * from projectbudget_initial_trannewsList ) projectbudget_initial_trannewsList," +
        //项目预算-修订累计-服务-new
        " (select * from projectbudgetrevisioservicenewsList ) projectbudgetrevisioservicenewsList," +
        //项目预算-修订-劳务-new
        " (select * from projectbudget_revise_labournewsList ) projectbudget_revise_labournewsList," +
        //项目预算-修订累计-运输-new
        " (select * from projectbudget_revision_trannewsList ) projectbudget_revision_trannewsList," +
        //项目预算-执行-服务-new
        " (select * from projectbudgetimplemeservicenewsList ) projectbudgetimplemeservicenewsList," +
        //项目预算-修订-运输-new
        " (select * from projectbudget_revise_trannewsList ) projectbudget_revise_trannewsList," +
        //项目预算-初始-耗材-new
        " (select * from projectbudgetinitialconsnewsList ) projectbudgetinitialconsnewsList," +
        //项目预算-执行-运输-new
        " (select * from projectbudgetimplementtrannewsList ) projectbudgetimplementtrannewsList," +
        // 项目预算-修订累计-劳务-new
        " (select * from projectbudgetrevisionlabournewsList ) projectbudgetrevisionlabournewsList," +
        //项目预算-修订累计-耗材-new
        " (select * from projectbudgetrevisionconssList ) projectbudgetrevisionconssList," +
        //项目预算-初始-服务-new
        " (select * from projectbudgetinitialservicenewsList ) projectbudgetinitialservicenewsList" +
        " from GT99994AT1.GT99994AT1.projectbudget_new where dr=0 and huijiqijian leftlike '" +
        substring(huijiqijian, 0, 7) +
        "'";
    }
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });