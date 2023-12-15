let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var paramReturn = param.return;
    var ownStaff = JSON.parse(param.requestData); //请求的单卡参数
    var ownMainJob = ownStaff.gxsStaffMainJobList[0]; //gxs员工 主任职 对象
    var ownMainJobStatus = ownStaff.gxsStaffMainJobList[0]._status; //gxs员工 主任职 数据状态
    let addSysStaffData = {
      id: ownStaff.sysStaff
    };
    let request = {};
    request.uri = "/yonbip/digitalModel/staff/save";
    let ownStaffArr = Object.keys(ownStaff);
    for (let i = 0; i < ownStaffArr.length; i++) {
      let ownStaffkey = ownStaffArr[i];
      switch (ownStaffkey) {
        case "name":
          addSysStaffData.name = ownStaff.name;
          break;
        case "sysemail":
          addSysStaffData.email = ownStaff.sysemail;
          break;
        case "mobile":
          addSysStaffData.mobile = ownStaff.mobile;
          break;
        case "code":
          addSysStaffData.code = ownStaff.code;
          break;
        case "IDTypeVO":
          addSysStaffData.cert_type = ownStaff.IDTypeVO;
          break;
        case "ordernumber":
          addSysStaffData.ordernumber = ownStaff.ordernumber;
          break;
        case "officetel":
          addSysStaffData.officetel = ownStaff.officetel;
          break;
        case "sex_enum":
          addSysStaffData.sex = ownStaff.sex_enum;
          break;
        case "remark":
          addSysStaffData.remark = ownStaff.remark;
          break;
        case "birthdate":
          addSysStaffData.birthdate = ownStaff.birthdate;
          break;
        case "_status":
          addSysStaffData._status = ownStaff._status;
          break;
        case "weixin":
          addSysStaffData.weixin = ownStaff.weixin;
          break;
        case "qq":
          addSysStaffData.qq = ownStaff.qq;
          break;
        case "BaseRegionVO":
          addSysStaffData.origin = ownStaff.BaseRegionVO;
          break;
          linkaddr;
        case "linkaddr":
          addSysStaffData.linkaddr = ownStaff.linkaddr;
          break;
          nationality;
        case "nationality":
          addSysStaffData.nationality = ownStaff.nationality;
          break;
        case "joinPartiesdate":
          addSysStaffData.joinpolitydate = ownStaff.joinPartiesdate;
          break;
        case "political":
          addSysStaffData.political_id = ownStaff.political;
          break;
          marital;
        case "marital":
          addSysStaffData.marital_id = ownStaff.marital;
          break;
        case "cert_no":
          addSysStaffData.cert_no = ownStaff.cert_no;
          break;
        case "biz_man_tag":
          addSysStaffData.biz_man_tag = ownStaff.biz_man_tag;
      }
    }
    let MainJobList = [];
    //查询内容
    var ownobject = {
      id: ownMainJob.id
    };
    //实体查询
    var ownMainJobRes = ObjectStore.selectById("GT34544AT7.GT34544AT7.gxsStaffMainJob", ownobject);
    let MainJobList0 = {
      id: ownMainJobRes.sysMainJobId,
      _status: ownMainJobStatus
    };
    let ownMainJobListKeyArr = Object.keys(ownMainJobRes);
    for (let i = 0; i < ownMainJobListKeyArr.length; i++) {
      let ownMainJobListKey = ownMainJobListKeyArr[i];
      switch (ownMainJobListKey) {
        case "sysOrg":
          MainJobList0.org_id = ownMainJobRes.sysOrg;
          break;
        case "endDate":
          MainJobList0.enddate = ownMainJobRes.endDate;
          break;
        case "beginDate":
          MainJobList0.begindate = ownMainJobRes.beginDate;
          break;
        case "sysDept":
          MainJobList0.dept_id = ownMainJobRes.sysDept;
          break;
        case "_status":
          MainJobList0._status = ownMainJobRes._status;
          break;
        case "psncl":
          MainJobList0.psncl_id = ownMainJobRes.psncl;
          break;
        case "director":
          MainJobList0.director = ownMainJobRes.director;
          break;
        case "responsibilities":
          MainJobList0.responsibilities = ownMainJobRes.responsibilities;
          break;
        case "jobGrade":
          MainJobList0.jobgrade_id = ownMainJobRes.jobGrade;
          break;
        case "Position":
          MainJobList0.post_id = ownMainJobRes.Position;
          break;
        case "job":
          MainJobList0.job_id = ownMainJobRes.job;
      }
    }
    MainJobList.push(MainJobList0);
    if (ownMainJob.endDate !== undefined) {
      //同步到系统员工
      addSysStaffData.mainJobList = MainJobList;
      request.body = { data: addSysStaffData };
      let func = extrequire("GT34544AT7.common.baseOpenApi");
      let sysStaff = func.execute(request).res;
      if (sysStaff.code === "999") {
        throw new Error("保存员工信息失败！0000" + sysStaff.message);
      }
      //回写数据到gxs员工
      var object = { id: paramReturn.id, isJob: "0" };
      var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
      //回写数据到任职子表
      var hxstaffobject = { id: paramReturn.gxsStaffMainJobList[0].id, isOnJob: "0" };
      var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
    } else {
      //同步到系统员工
      addSysStaffData.mainJobList = MainJobList;
      request.body = { data: addSysStaffData };
      let func = extrequire("GT34544AT7.common.baseOpenApi");
      let sysStaff = func.execute(request).res;
      if (sysStaff.code === "999") {
        throw new Error("保存员工信息失败！\n" + sysStaff.message);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });