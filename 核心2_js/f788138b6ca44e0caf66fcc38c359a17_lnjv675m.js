let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paramReturn = param.return;
    let org_id = paramReturn.org_id;
    //查询当前的当前账务年度
    let AccYearsql = "select AccYear from GT104180AT23.GT104180AT23.CoopOrgParameter where org_id = '" + org_id + "' and dr = 0";
    let AccYearres = ObjectStore.queryByYonQL(AccYearsql);
    let AccYear = AccYearres[0].AccYear;
    let membertype_coopcode = paramReturn.membertype_coopcode;
    membertype_coopcode = substring(membertype_coopcode, 0, 1);
    if (membertype_coopcode == "c") {
      //法人
      //查询实时的该组织的法人成员数量和农民成员数量
      let m1sql = "select id,PersonMemberCount,OrgMemberCount from GT104180AT23.GT104180AT23.CoopbasicOrg where org_id = '" + org_id + "' and dr = 0";
      let m1res = ObjectStore.queryByYonQL(m1sql);
      //将查询到的数量+1
      let PersonMemberCount = m1res[0].PersonMemberCount + 1;
      let OrgMemberCount = m1res[0].OrgMemberCount + 1;
      let id = m1res[0].id;
      let sunsql = "select id,PersonMemberCount,OrgMemberCount from GT104180AT23.GT104180AT23.OrgYearInfo where baseOrg = '" + org_id + "' and AccYear = '" + AccYear + "' and dr = 0";
      let sunres = ObjectStore.queryByYonQL(sunsql);
      let sunPersonMemberCount = sunres[0].PersonMemberCount + 1;
      let sunOrgMemberCount = sunres[0].OrgMemberCount + 1;
      let sunid = sunres[0].id;
      //重新保存
      var object = {
        id: id,
        PersonMemberCount: PersonMemberCount,
        OrgMemberCount: OrgMemberCount,
        OrgYearInfoList: [{ id: sunid, _status: "Update", PersonMemberCount: sunPersonMemberCount, OrgMemberCount: sunOrgMemberCount }]
      };
      var res = ObjectStore.updateById("GT104180AT23.GT104180AT23.CoopbasicOrg", object, "yb44f724ed");
      if (!res.id) {
        throw new Error("统计社员数量时出错，请联系管理员！");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });