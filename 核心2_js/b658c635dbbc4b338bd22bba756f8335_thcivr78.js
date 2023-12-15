let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var type = request.type;
    var role = request.role; //1 收货人 2 库管员 3司机 4销售人员
    var name = request.name;
    var phone = request.phone; //客户电话
    var keyword = request.keyword; //搜索参数
    var sql = "";
    var condition = " and verifystate = 2 ";
    var conditionList = " and verifystate = 2 ";
    if (role == 1) {
      //收货人
      condition += " and CusContactnumber = '" + phone + "'";
    } else if (role == 2) {
      //库管员
      condition += " and FaXiangRenPhone = '" + phone + "'";
    } else if (role == 3) {
      condition += " and DriverPhone = '" + phone + "'";
    } else if (role == 4) {
      condition += " and YeWuYuan = '" + name + "'";
    }
    if (type == 1) {
      //未发货装箱单
      if (role == 2) {
        sql = "select *,org_id.name from AT175A93621C400009.AT175A93621C400009.rzh01 where WuLiuDanHao = null" + condition + " order by createTime desc";
      } else if (role == 1) {
        //收货人
        sql = "select *,org_id.name from AT175A93621C400009.AT175A93621C400009.rzh01 where WuLiuDanHao = null" + condition1 + " order by createTime desc";
      }
    } else if (type == 2) {
      //运输中装箱单
      //单个签收人
      //多个签收人
      if (keyword != "" && keyword != null) {
        sql =
          "select distinct *,org_id.name from AT175A93621C400009.AT175A93621C400009.rzh01 rzh01 left join AT175A93621C400009.AT175A93621C400009.rzh04 rzh04 on rzh01.id = rzh04.rzh01_id where QianShouRen = '未签收' " +
          condition +
          " and rzh04.Pallet_code = " +
          keyword +
          " order by createTime desc";
      } else {
        sql = "select *,org_id.name from AT175A93621C400009.AT175A93621C400009.rzh01 where QianShouRen = '未签收'" + condition + " order by createTime desc";
      }
    } else if (type == 3) {
      //已签名装箱单
      //单个签收人
      //多个签收人
      if (keyword != "" && keyword != null) {
        sql =
          "select distinct *,org_id.name from AT175A93621C400009.AT175A93621C400009.rzh01 rzh01 left join AT175A93621C400009.AT175A93621C400009.rzh04 rzh04 on rzh01.id = rzh04.rzh01_id where not QianShouRen = '未签收' " +
          condition +
          " and rzh04.Pallet_code = " +
          keyword +
          " order by createTime desc";
      } else {
        sql = "select *,org_id.name from AT175A93621C400009.AT175A93621C400009.rzh01 where not QianShouRen = '未签收'" + condition + " order by createTime desc";
      }
    } else if (type == 5) {
      if (keyword != "" && keyword != null) {
        sql =
          "select distinct *,org_id.name from AT175A93621C400009.AT175A93621C400009.rzh01 rzh01 left join AT175A93621C400009.AT175A93621C400009.rzh04 rzh04 on rzh01.id = rzh04.rzh01_id where 1 = 1 " +
          condition +
          " and rzh04.Pallet_code = " +
          keyword +
          " order by createTime desc";
      } else {
        sql = "select *,org_id.name from AT175A93621C400009.AT175A93621C400009.rzh01 where 1 = 1" + condition + " order by createTime desc";
      }
    }
    var res = ObjectStore.queryByYonQL(sql);
    return { data: res, sql: sql, request: request, condition: condition };
  }
}
exports({ entryPoint: MyAPIHandler });