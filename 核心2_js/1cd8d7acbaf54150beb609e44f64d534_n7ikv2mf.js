let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //参数接收
    //总部名称
    var companyName = request.companyName;
    //大区名称
    var areaName = request.areaName;
    //组织名称
    var organName = request.organName;
    //伙伴编码
    var partnerCode = request.partnerCode;
    //伙伴名称
    var partnerName = request.partnerName;
    //合同编码
    var contractCode = request.contractCode;
    //项目编码
    var projectCode = request.projectCode;
    //项目名称
    var projectName = request.projectName;
    //外包顾问名称
    var partnerUserName = request.partnerUserName;
    //外包顾问手机号
    var partnerUserTel = request.partnerUserTel;
    //外包顾问职级
    var partnerUserRank = request.partnerUserRank;
    //实际总人天(约当前+自然日)
    var approvalWorkHour = request.approvalWorkHour;
    //集团级实际总人天(约当后+已签约)
    var belongToFinishRate = request.belongToFinishRate;
    //集团级实际总人天(约当后+未签约)
    var unBelongToFinishRate = request.unBelongToFinishRate;
    //机构级实际总人天(约当后+已签约)
    var belongToFinishRateOrg = request.belongToFinishRateOrg;
    //机构级实际总人天(约当后+未签约)
    var unBelongToFinishRateOrg = request.unBelongToFinishRateOrg;
    //项目状态
    var projectStatusType = request.projectStatusType;
    //立项日期
    var setupProjectDate = request.setupProjectDate;
    //项目成员角色
    var projectrole = request.projectrole;
    //进入项目时间
    var enterprojectdate = request.enterprojectdate;
    //离开项目时间
    var leaveprojectdate = request.leaveprojectdate;
    var parameter = {
      companyName: companyName,
      areaName: areaName,
      organName: organName,
      partnerCode: partnerCode,
      partnerName: partnerName,
      contractCode: contractCode,
      projectCode: projectCode,
      projectName: projectName,
      partnerUserName: partnerUserName,
      partnerUserTel: partnerUserTel,
      partnerUserRank: partnerUserRank,
      approvalWorkHour: approvalWorkHour,
      belongToFinishRate: belongToFinishRate,
      unBelongToFinishRate: unBelongToFinishRate,
      belongToFinishRateOrg: belongToFinishRateOrg,
      unBelongToFinishRateOrg: unBelongToFinishRateOrg,
      projectStatusType: projectStatusType,
      setupProjectDate: setupProjectDate,
      projectrole: projectrole,
      enterprojectdate: enterprojectdate,
      leaveprojectdate: leaveprojectdate
    };
    var res = ObjectStore.insert("AT17E908FC08280001.AT17E908FC08280001.partner_workhours", parameter, "partner_workhours");
    var updateWrapper = new Wrapper();
    updateWrapper.eq("part_project_code", projectCode);
    var toUpdate = {
      pmsc_hoursList: [
        {
          partnerUserName: partnerUserName,
          approvalWorkHours: approvalWorkHour,
          approvalWorkHours: approvalWorkHour,
          enterprojectdate: enterprojectdate,
          leaveprojectdate: leaveprojectdate,
          _status: "Insert"
        }
      ]
    };
    var res_ = ObjectStore.update("AT17E908FC08280001.AT17E908FC08280001.part_out_resouce", toUpdate, updateWrapper, "ybd993b5aa");
    return { res_ };
  }
}
exports({ entryPoint: MyAPIHandler });