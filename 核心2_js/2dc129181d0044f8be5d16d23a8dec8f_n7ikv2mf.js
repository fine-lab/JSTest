let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let advisors = request.advisors;
    let part_outsouce_mode = request.part_outsouce_mode;
    let part_start_date = request.part_start_date;
    let part_end_date = request.part_end_date;
    let part_pro_month = request.part_pro_month;
    let part_pre_project = request.part_pre_project;
    let part_link_project = request.part_link_project;
    let sql = "select distinct part_project_name,code,adl.advisorName as part_advisor_name from ";
    sql += "AT17E908FC08280001.AT17E908FC08280001.part_out_resouce ";
    sql += "left join AT17E908FC08280001.AT17E908FC08280001.part_out_resouce_advisor ad on id = ad.part_out_resouce_id ";
    sql += "left join AT17E908FC08280001.AT17E908FC08280001.part_advisor_list adl on adl.id = ad.part_advisor ";
    sql += "where dr=0 and ad.dr=0  and ad.part_advisor in ('" + advisors.join("','") + "') ";
    sql += " and part_pro_month='" + part_pro_month + "'  and part_is_closed2<>'Y'";
    if (part_outsouce_mode == "POM01" || part_outsouce_mode == "POM02") {
      //整包、分包的顾问  不能在人天外包中；  人天外包的顾问不能在其他任何项目
      sql += " and part_outsouce_mode='POM03'";
    }
    if (id && id !== "") {
      sql += " and id<>'" + id + "'";
    }
    if (part_pre_project && part_pre_project !== "") {
      sql += " and id<>'" + part_pre_project + "'";
    }
    if (part_link_project && part_link_project !== "") {
      sql += " and id<>'" + part_link_project + "'";
    }
    sql += " and (";
    sql += " (part_end_date>'" + part_start_date + "' and part_end_date<='" + part_end_date + "') ";
    sql += " or (part_start_date>='" + part_start_date + "' and part_start_date<'" + part_end_date + "') ";
    sql += " or (part_start_date<='" + part_start_date + "' and part_end_date>='" + part_end_date + "') ";
    sql += " ) ";
    let result = {};
    result.sql = sql;
    try {
      let adRes = ObjectStore.queryByYonQL(sql);
      result.adRes = adRes;
    } catch (e) {
      result.e = e;
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });