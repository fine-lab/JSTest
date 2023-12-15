let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paramReturn = param.return;
    let org_id = paramReturn.org_id;
    //查询当前的当前账务年度
    let AccYearsql = "select AccYear from GT104180AT23.GT104180AT23.CoopOrgParameter where org_id = '" + org_id + "' and dr = 0";
    let AccYearres = ObjectStore.queryByYonQL(AccYearsql);
    let AccYear = AccYearres[0].AccYear;
    //个人计数有两种情况，1.农民  2.居民
    let membertype_coopcode = paramReturn.membertype_coopcode;
    if (membertype_coopcode == "m1") {
      //农民
      //查询实时的该组织的个人成员数量和农民成员数量
      let m1sql = "select id,PersonMemberCount,PersonMemberCount_F from GT104180AT23.GT104180AT23.CoopbasicOrg where org_id = '" + org_id + "' and dr = 0";
      let m1res = ObjectStore.queryByYonQL(m1sql);
      //将查询到的数量+1
      let PersonMemberCount = m1res[0].PersonMemberCount + 1;
      let PersonMemberCount_F = m1res[0].PersonMemberCount_F + 1;
      let id = m1res[0].id;
      let sunsql = "select id,PersonMemberCount,PersonMemberCount_F from GT104180AT23.GT104180AT23.OrgYearInfo where baseOrg = '" + org_id + "' and AccYear = '" + AccYear + "' and dr = 0";
      let sunres = ObjectStore.queryByYonQL(sunsql);
      let sunPersonMemberCount = sunres[0].PersonMemberCount + 1;
      let sunPersonMemberCount_F = sunres[0].PersonMemberCount_F + 1;
      let sunid = sunres[0].id;
      //重新保存
      var object = {
        id: id,
        PersonMemberCount: PersonMemberCount,
        PersonMemberCount_F: PersonMemberCount_F,
        OrgYearInfoList: [{ id: sunid, _status: "Update", PersonMemberCount: sunPersonMemberCount, PersonMemberCount_F: sunPersonMemberCount_F }]
      };
      var res = ObjectStore.updateById("GT104180AT23.GT104180AT23.CoopbasicOrg", object, "yb44f724ed");
      if (!res.id) {
        throw new Error("统计社员数量时出错，请联系管理员！");
      }
    }
    if (membertype_coopcode == "m2") {
      //居民
      //查询实时的该组织的个人成员数量和农民成员数量
      let m1sql = "select id,PersonMemberCount,PersonMemberCount_R from GT104180AT23.GT104180AT23.CoopbasicOrg where org_id = '" + org_id + "' and dr = 0";
      let m1res = ObjectStore.queryByYonQL(m1sql);
      //将查询到的数量+1
      let PersonMemberCount = m1res[0].PersonMemberCount + 1;
      let PersonMemberCount_R = m1res[0].PersonMemberCount_R + 1;
      let id = m1res[0].id;
      let sunsql = "select id,PersonMemberCount,PersonMemberCount_R from GT104180AT23.GT104180AT23.OrgYearInfo where baseOrg = '" + org_id + "' and AccYear = '" + AccYear + "' and dr = 0";
      let sunres = ObjectStore.queryByYonQL(sunsql);
      let sunPersonMemberCount = sunres[0].PersonMemberCount + 1;
      let sunPersonMemberCount_R = sunres[0].PersonMemberCount_R + 1;
      let sunid = sunres[0].id;
      //重新保存
      var object = {
        id: id,
        PersonMemberCount: PersonMemberCount,
        PersonMemberCount_R: PersonMemberCount_R,
        OrgYearInfoList: [{ id: sunid, _status: "Update", PersonMemberCount: sunPersonMemberCount, PersonMemberCount_R: sunPersonMemberCount_R }]
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