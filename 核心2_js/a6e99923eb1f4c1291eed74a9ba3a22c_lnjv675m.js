let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //员工初始化
    var paramReturn = param.return;
    var ownStaff = JSON.parse(param.requestData); //请求的单卡参数
    let staffSource = ownStaff.staffSource; //信息来源
    if (staffSource == "initialization") {
      let sysStaffID = ownStaff.sysStaff; //系统员工ID
      let SysStaffJobType = ownStaff.gxsStaffMainJobList[0].SysStaffJobType;
      let item1707ni = ownStaff.item1707ni; //系统员工编码
      let request = {};
      request.uri = "/yonbip/digitalModel/staff/save";
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
      //拼接任职兼职参数
      let MainJobList = []; //任职
      let ptJobList = []; //兼职
      let gxsStaffMainJobList = ownStaff.gxsStaffMainJobList;
      let gxsStaffMainJobListLength = gxsStaffMainJobList.length;
      for (let i = 0; i < gxsStaffMainJobListLength; i++) {
        let ownMainJob = ownStaff.gxsStaffMainJobList[i];
        let SysStaffJobType = ownMainJob.SysStaffJobType;
        //判断该条记录是任职还是兼职
        if (SysStaffJobType == "1") {
          //兼职
          let ptJob = {
            enable: 1,
            _status: "Insert"
          };
          let ownMainJobListKeyArr = Object.keys(ownMainJob);
          for (let i = 0; i < ownMainJobListKeyArr.length; i++) {
            let ownMainJobListKey = ownMainJobListKeyArr[i];
            switch (ownMainJobListKey) {
              case "sysOrg":
                ptJob.org_id = ownMainJob.sysOrg;
                break;
              case "sysDept":
                ptJob.dept_id = ownMainJob.sysDept;
                break;
              case "beginDate":
                ptJob.begindate = ownMainJob.beginDate;
                break;
              case "psncl":
                ptJob.psncl_id = ownMainJob.psncl;
                break;
              case "director":
                ptJob.director = ownMainJob.director;
                break;
              case "responsibilities":
                ptJob.responsibilities = ownMainJob.responsibilities;
                break;
              case "jobGrade":
                ptJob.jobgrade_id = ownMainJob.jobGrade;
                break;
              case "Position":
                ptJob.post_id = ownMainJob.Position;
                break;
              case "job":
                ptJob.job_id = ownMainJob.job;
            }
          }
          ptJobList.push(ptJob);
        } else if (SysStaffJobType == "0") {
          //任职
          let MainJobList0 = {
            enable: 1,
            _status: "Insert"
          };
          let ownMainJobListKeyArr = Object.keys(ownMainJob);
          for (let i = 0; i < ownMainJobListKeyArr.length; i++) {
            let ownMainJobListKey = ownMainJobListKeyArr[i];
            switch (ownMainJobListKey) {
              case "sysOrg":
                MainJobList0.org_id = ownMainJob.sysOrg;
                break;
              case "sysDept":
                MainJobList0.dept_id = ownMainJob.sysDept;
                break;
              case "beginDate":
                MainJobList0.begindate = ownMainJob.beginDate;
                break;
              case "psncl":
                MainJobList0.psncl_id = ownMainJob.psncl;
                break;
              case "director":
                MainJobList0.director = ownMainJob.director;
                break;
              case "responsibilities":
                MainJobList0.responsibilities = ownMainJob.responsibilities;
                break;
              case "jobGrade":
                MainJobList0.jobgrade_id = ownMainJob.jobGrade;
                break;
              case "Position":
                MainJobList0.post_id = ownMainJob.Position;
                break;
              case "job":
                MainJobList0.job_id = ownMainJob.job;
            }
          }
          MainJobList.push(MainJobList0);
        }
      }
      if (sysStaffID == undefined || sysStaffID == "" || sysStaffID.length == 0) {
        //说明系统里面没有该员工信息
        addSysStaffData._status = "Insert";
        //同步到系统员工
        addSysStaffData.mainJobList = MainJobList;
        if (ptJobList.length > 0) {
          addSysStaffData.ptJobList = ptJobList;
        }
        request.body = { data: addSysStaffData };
        let func = extrequire("GT34544AT7.common.baseOpenApi");
        let sysStaff = func.execute(request).res;
        if (sysStaff.code === "999") {
          let param999 = { title: "员工初始化登记失败", content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：无" };
          let func999 = extrequire("GT34544AT7.common.push");
          let res999 = func999.execute(param999);
          throw new Error("员工初始化登记失败！1\n" + sysStaff.message);
        }
        //回写数据到gxs员工
        var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
        var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
        //回写数据到任职子表
        for (let x = 0; x < gxsStaffMainJobList.length; x++) {
          let sysDept = gxsStaffMainJobList[x].sysDept;
          SysStaffJobType = gxsStaffMainJobList[x].SysStaffJobType;
          if (SysStaffJobType == "1") {
            let sysPtJobList = sysStaff.data.ptJobList;
            for (let y = 0; y < sysPtJobList.length; y++) {
              let dept = sysPtJobList[y].dept_id;
              if (sysDept == dept) {
                let sysMainJobId = sysPtJobList[y].id;
                var hxstaffobject = {
                  id: paramReturn.gxsStaffMainJobList[x].id,
                  isOnJob: "1",
                  txtID: paramReturn.gxsStaffMainJobList[x].id,
                  sysMainJobId: sysMainJobId,
                  sysStaff: sysStaff.data.id,
                  GxyStaffCode: paramReturn.code,
                  sysStaffCode: sysStaff.data.code
                };
                var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
              }
            }
          } else if (SysStaffJobType == "0") {
            let sysMainJobId = sysStaff.data.mainJobList[0].id;
            var hxstaffobject = {
              id: paramReturn.gxsStaffMainJobList[x].id,
              isOnJob: "1",
              txtID: paramReturn.gxsStaffMainJobList[x].id,
              sysMainJobId: sysMainJobId,
              sysStaff: sysStaff.data.id,
              GxyStaffCode: paramReturn.code,
              sysStaffCode: sysStaff.data.code
            };
            var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
          }
        }
      } else {
        //说明系统里面有该员工信息
        //新增主任职
        if (SysStaffJobType == 0) {
          addSysStaffData._status = "Update";
          addSysStaffData.id = sysStaffID;
          //同步到系统员工
          addSysStaffData.mainJobList = MainJobList;
          if (ptJobList.length > 0) {
            addSysStaffData.ptJobList = ptJobList;
          }
          request.body = { data: addSysStaffData };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let sysStaff = func.execute(request).res;
          if (sysStaff.code === "999") {
            let param999 = {
              title: "员工初始化登记失败",
              content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：无"
            };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("员工初始化登记失败！2\n" + sysStaff.message);
          }
          //回写数据到gxs员工
          var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
          var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
          //回写数据到任职子表
          for (let x = 0; x < gxsStaffMainJobList.length; x++) {
            let sysDept = gxsStaffMainJobList[x].sysDept;
            SysStaffJobType = gxsStaffMainJobList[x].SysStaffJobType;
            if (SysStaffJobType == "1") {
              let sysPtJobList = sysStaff.data.ptJobList;
              for (let y = 0; y < sysPtJobList.length; y++) {
                let dept = sysPtJobList[y].dept_id;
                if (sysDept == dept) {
                  let sysMainJobId = sysPtJobList[y].id;
                  var hxstaffobject = {
                    id: paramReturn.gxsStaffMainJobList[x].id,
                    isOnJob: "1",
                    txtID: paramReturn.gxsStaffMainJobList[x].id,
                    sysMainJobId: sysMainJobId,
                    sysStaff: sysStaff.data.id,
                    GxyStaffCode: paramReturn.code,
                    sysStaffCode: sysStaff.data.code
                  };
                  var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
                }
              }
            } else if (SysStaffJobType == "0") {
              let sysMainJobId = sysStaff.data.mainJobList[0].id;
              var hxstaffobject = {
                id: paramReturn.gxsStaffMainJobList[x].id,
                isOnJob: "1",
                txtID: paramReturn.gxsStaffMainJobList[x].id,
                sysMainJobId: sysMainJobId,
                sysStaff: sysStaff.data.id,
                GxyStaffCode: paramReturn.code,
                sysStaffCode: sysStaff.data.code
              };
              var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
            }
          }
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
          addSysStaffData.ptJobList = ptJobList;
          request.body = { data: addSysStaffData };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let sysStaff = func.execute(request).res;
          if (sysStaff.code === "999") {
            let param999 = {
              title: "员工初始化登记失败",
              content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：有"
            };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("员工初始化登记失败！3\n" + sysStaff.message);
          }
          //回写数据到gxs员工
          var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
          var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
          //回写数据到任职子表
          for (let x = 0; x < gxsStaffMainJobList.length; x++) {
            let sysDept = gxsStaffMainJobList[x].sysDept;
            SysStaffJobType = gxsStaffMainJobList[x].SysStaffJobType;
            if (SysStaffJobType == "1") {
              let sysPtJobList = sysStaff.data.ptJobList;
              for (let y = 0; y < sysPtJobList.length; y++) {
                let dept = sysPtJobList[y].dept_id;
                if (sysDept == dept) {
                  let sysMainJobId = sysPtJobList[y].id;
                  var hxstaffobject = {
                    id: paramReturn.gxsStaffMainJobList[x].id,
                    isOnJob: "1",
                    txtID: paramReturn.gxsStaffMainJobList[x].id,
                    sysMainJobId: sysMainJobId,
                    sysStaff: sysStaff.data.id,
                    GxyStaffCode: paramReturn.code,
                    sysStaffCode: sysStaff.data.code
                  };
                  var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
                }
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });