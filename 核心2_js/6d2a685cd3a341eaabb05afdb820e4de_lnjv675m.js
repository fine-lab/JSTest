let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //员工入职登记
    var ownStaff = JSON.parse(param.requestData); //请求的单卡参数
    var paramReturn = param.return;
    let staffSource = ownStaff.staffSource; //信息来源
    if (staffSource == "joinEntry") {
      let sysStaffID = ownStaff.sysStaff; //系统员工ID
      let SysStaffJobType = ownStaff.gxsStaffMainJobList[0].SysStaffJobType;
      let request = {};
      request.uri = "/yonbip/digitalModel/staff/save";
      let item1707ni = ownStaff.item1707ni; //系统员工编码
      let addSysStaffData = {
        enable: 1
      };
      if (item1707ni) {
        addSysStaffData.code = item1707ni;
      } else {
        addSysStaffData.code = paramReturn.code;
      }
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
          case "weixin":
            addSysStaffData.weixin = ownStaff.weixin;
            break;
          case "qq":
            addSysStaffData.qq = ownStaff.qq;
            break;
          case "BaseRegionVO":
            addSysStaffData.origin = ownStaff.BaseRegionVO;
            break;
          case "linkaddr":
            addSysStaffData.linkaddr = ownStaff.linkaddr;
            break;
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
      let MainJobList0 = {
        enable: 1
      };
      let ownMainJobList = ownStaff.gxsStaffMainJobList[0];
      let ownMainJobListKeyArr = Object.keys(ownMainJobList);
      for (let i = 0; i < ownMainJobListKeyArr.length; i++) {
        let ownMainJobListKey = ownMainJobListKeyArr[i];
        switch (ownMainJobListKey) {
          case "sysOrg":
            MainJobList0.org_id = ownMainJobList.sysOrg;
            break;
          case "sysDept":
            MainJobList0.dept_id = ownMainJobList.sysDept;
            break;
          case "beginDate":
            MainJobList0.begindate = ownMainJobList.beginDate;
            break;
          case "psncl":
            MainJobList0.psncl_id = ownMainJobList.psncl;
            break;
          case "director":
            MainJobList0.director = ownMainJobList.director;
            break;
          case "responsibilities":
            MainJobList0.responsibilities = ownMainJobList.responsibilities;
            break;
          case "jobGrade":
            MainJobList0.jobgrade_id = ownMainJobList.jobGrade;
            break;
          case "Position":
            MainJobList0.post_id = ownMainJobList.Position;
            break;
          case "job":
            MainJobList0.job_id = ownMainJobList.job;
        }
      }
      if (sysStaffID == undefined || sysStaffID == "" || sysStaffID.length == 0) {
        //说明系统里面没有该员工信息
        addSysStaffData._status = "Insert";
        MainJobList0._status = "Insert";
        MainJobList.push(MainJobList0);
        //同步到系统员工
        addSysStaffData.mainJobList = MainJobList;
        request.body = { data: addSysStaffData };
        let func = extrequire("GT34544AT7.common.baseOpenApi");
        let sysStaff = func.execute(request).res;
        if (sysStaff.code === "999") {
          let param999 = { title: "员工入职登记失败", content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：无" };
          let func999 = extrequire("GT34544AT7.common.push");
          let res999 = func999.execute(param999);
          throw new Error("员工入职登记失败！1\n" + sysStaff.message);
        }
        //回写数据到gxs员工
        var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
        var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
        let sysMainJobId = sysStaff.data.mainJobList[0].id;
        //回写数据到任职子表
        var hxstaffobject = {
          id: paramReturn.gxsStaffMainJobList[0].id,
          isOnJob: "1",
          txtID: paramReturn.gxsStaffMainJobList[0].id,
          sysMainJobId: sysMainJobId,
          sysStaff: sysStaff.data.id,
          GxyStaffCode: paramReturn.code,
          sysStaffCode: sysStaff.data.code
        };
        var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
      } else {
        //说明系统里面有该员工信息
        if (SysStaffJobType == 0) {
          //新增主任职
          addSysStaffData._status = "Update";
          addSysStaffData.id = sysStaffID;
          MainJobList0._status = "Insert";
          MainJobList.push(MainJobList0);
          //同步到系统员工
          addSysStaffData.mainJobList = MainJobList;
          request.body = { data: addSysStaffData };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let sysStaff = func.execute(request).res;
          if (sysStaff.code === "999") {
            let param999 = {
              title: "员工入职登记失败",
              content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：无"
            };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("员工入职登记失败！2\n" + sysStaff.message);
          }
          //回写数据到gxs员工
          var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
          var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
          let sysMainJobId = sysStaff.data.mainJobList[0].id;
          //回写数据到任职子表
          var hxstaffobject = {
            id: paramReturn.gxsStaffMainJobList[0].id,
            isOnJob: "1",
            txtID: paramReturn.gxsStaffMainJobList[0].id,
            sysMainJobId: sysMainJobId,
            sysStaff: sysStaff.data.id,
            GxyStaffCode: paramReturn.code,
            sysStaffCode: sysStaff.data.code
          };
          var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
        } else {
          //新增兼职
          //查询系统员工信息
          let func1 = extrequire("GT34544AT7.staff.showStaffById");
          let func1staff = func1.execute({ id: ownStaff.sysStaff }).res.data;
          let mainJobList = func1staff.mainJobList;
          mainJobList[0]._status = "Update";
          delete mainJobList[0].pubts;
          addSysStaffData._status = "Update";
          addSysStaffData.id = sysStaffID;
          addSysStaffData.mainJobList = mainJobList;
          MainJobList0._status = "Insert";
          addSysStaffData.ptJobList = MainJobList0;
          request.body = { data: addSysStaffData };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let sysStaff = func.execute(request).res;
          if (sysStaff.code === "999") {
            let param999 = {
              title: "员工入职登记失败",
              content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：有"
            };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("员工入职登记失败！3\n" + sysStaff.message);
          }
          //回写数据到gxs员工
          var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
          var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
          let sysMainJobId = sysStaff.data.mainJobList[0].id;
          //回写数据到任职子表
          var hxstaffobject = {
            id: paramReturn.gxsStaffMainJobList[0].id,
            isOnJob: "1",
            txtID: paramReturn.gxsStaffMainJobList[0].id,
            sysMainJobId: sysMainJobId,
            sysStaff: sysStaff.data.id,
            GxyStaffCode: paramReturn.code,
            sysStaffCode: sysStaff.data.code
          };
          var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });