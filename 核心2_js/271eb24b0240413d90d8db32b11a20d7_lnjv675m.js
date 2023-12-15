let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var paramReturn = param.return;
    var ownStaff = JSON.parse(param.requestData); //请求的单卡参数
    let sysStaff = ownStaff.sysStaff; //系统员工ID
    let staffSource = ownStaff.staffSource;
    if (staffSource == "YGDJ" || staffSource == "CJYYSGLY") {
      var gxsStaffMainJobList = ownStaff.gxsStaffMainJobList[0];
      let isJZ = gxsStaffMainJobList.SysStaffJobType;
      let sysStaffCode = gxsStaffMainJobList.sysStaffCode;
      var ownStaffStatus = ownStaff._status; //gxs员工 数据状态
      var haveOwnMainJob = ownStaff.gxsStaffMainJobList; //是否有子实体
      if (haveOwnMainJob !== undefined) {
        var ownMainJobStatus = ownStaff.gxsStaffMainJobList[0]._status; //gxs员工 主任职 数据状态
        var ownMainJob = ownStaff.gxsStaffMainJobList[0]; //gxs员工 主任职 对象
      }
      if (ownStaffStatus === "Insert" && ownMainJobStatus === "Insert") {
        let addSysStaffData = {
          enable: 1
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
              addSysStaffData.code = sysStaffCode;
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
            case "_status":
              MainJobList0._status = ownMainJobList._status;
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
              MainJobList0.post_id = ownMainJobList.Position; //岗位
              break;
            case "job":
              MainJobList0.job_id = ownMainJobList.job;
              break;
            case "Posts":
              MainJobList0.new_post_id = ownMainJobList.Posts; //职位
          }
        }
        MainJobList.push(MainJobList0);
        if (isJZ == 1 || isJZ == "1") {
          //说明是兼职信息
          let func1 = extrequire("GT34544AT7.staff.showStaffById");
          let staff = func1.execute({ id: ownStaff.sysStaff }).res.data;
          staff._status = "Update";
          delete staff.pubts;
          if (staff.bankAcctList !== undefined && staff.bankAcctList.length > 0) {
            delete staff.bankAcctList;
          }
          let mainJobList = staff.mainJobList;
          mainJobList[0]._status = "Update";
          delete mainJobList[0].pubts;
          if (ownStaff.code == undefined || ownStaff.code == null || ownStaff.code == "") {
            //说明是业务流推过来的数据
            //业务流推过来的数据可能来自： 1.区域管理员设置 2.组织管理员设置
            //添加管理员的兼职信息的时候系统员工有两种情况： 1有可能系统员工  2.没有
            //说明有系统员工信息
            //有系统员工信息，不管，正常流程保存
            //表单没有传code过来就说明这个数据源是通过推单来的
            //同步到系统员工
            staff.name = ownStaff.name; //staff是取的系统员工信息，需要把上游单据的身份证号码等信息传进去
            staff.cert_no = ownStaff.cert_no;
            staff.ptJobList = MainJobList;
            request.body = { data: staff };
            let func = extrequire("GT34544AT7.common.baseOpenApi");
            let sysStaff = func.execute(request).res;
            if (sysStaff.code === "999") {
              let param999 = {
                title: "员工登记失败（启用后登记）",
                content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：有"
              };
              let func999 = extrequire("GT34544AT7.common.push");
              let res999 = func999.execute(param999);
              throw new Error("\n保存员工信息失败！999999\n" + sysStaff.message);
            }
            //回写数据到gxs员工
            var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
            var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
            let sysMainJobId = sysStaff.data.mainJobList[0].id;
            //回写数据到任职子表
            var hxstaffobject = { id: paramReturn.gxsStaffMainJobList[0].id, isOnJob: "1", txtID: paramReturn.gxsStaffMainJobList[0].id, sysMainJobId: sysMainJobId, sysStaff: sysStaff.data.id };
            var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
          } else {
            //说明入口为  员工登记
            let ptJobList = [];
            ptJobList.push(MainJobList0);
            staff.ptJobList = ptJobList;
            request.body = { data: staff };
            let func = extrequire("GT34544AT7.common.baseOpenApi");
            let sysStaff = func.execute(request).res;
            if (sysStaff.code === "999") {
              let param999 = {
                title: "员工登记失败",
                content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：有"
              };
              let func999 = extrequire("GT34544AT7.common.push");
              let res999 = func999.execute(param999);
              throw new Error("\n保存员工信息失败！777777\n" + sysStaff.message);
            }
            let sysJZId = sysStaff.data.ptJobList[0].id;
            //回写数据到gxs员工
            var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
            var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
            //回写数据到任职子表
            var hxstaffobject = { id: paramReturn.gxsStaffMainJobList[0].id, isOnJob: "1", txtID: paramReturn.gxsStaffMainJobList[0].id, sysMainJobId: sysJZId, sysStaff: sysStaff.data.id };
            var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
          }
        } else {
          //说明不是兼职信息
          //不是兼职信息，有两种情况：1.已经是系统员工  2.不是系统员工
          if (ownStaff.sysStaff !== undefined && ownStaff.sysStaff !== null && ownStaff.sysStaff !== "") {
            //说明已经是系统员工
            addSysStaffData.id = ownStaff.sysStaff; //已经是系统员工了就需要传员工id
            addSysStaffData._status = "Update";
          } else {
            //不是系统员工
            addSysStaffData._status = "Insert";
          }
          //表单没有传code过来就说明这个数据源是通过推单来的 来源为：1.组织管理员设置 2.区域管理员设置
          if (ownStaff.code == undefined || ownStaff.code == null || ownStaff.code == "") {
            addSysStaffData.ptJobList = {
              org_id: ownStaff.org_id,
              dept_id: ownStaff.remark,
              begindate: ownStaff.enablets,
              _status: "Insert"
            };
          }
          //同步到系统员工
          addSysStaffData.mainJobList = MainJobList;
          request.body = { data: addSysStaffData };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let sysStaff = func.execute(request).res;
          if (sysStaff.code === "999") {
            let param999 = {
              title: "员工登记失败",
              content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：无"
            };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("保存员工信息失败！888888\n" + sysStaff.message);
          }
          //回写数据到gxs员工
          var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
          var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
          let sysMainJobId = sysStaff.data.mainJobList[0].id;
          //回写数据到任职子表
          var hxstaffobject = { id: paramReturn.gxsStaffMainJobList[0].id, isOnJob: "1", txtID: paramReturn.gxsStaffMainJobList[0].id, sysMainJobId: sysMainJobId, sysStaff: sysStaff.data.id };
          var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
        }
      } else if (ownStaffStatus === "Update" && ownMainJobStatus === "Update") {
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
              addSysStaffData.code = sysStaffCode;
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
              break;
            case "Posts":
              MainJobList0.new_post_id = ownMainJobRes.Posts; //职位
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
            throw new Error("保存员工信息失败！0000\n" + sysStaff.message);
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
            let param999 = { title: "员工登记失败", content: "更新任职失败:\n" + "\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：有" };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("保存员工信息失败！111111\n" + sysStaff.message);
          }
        }
      } else if (ownStaffStatus === "Update" && haveOwnMainJob === undefined) {
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
              addSysStaffData.code = ownStaff.sysStaffCode;
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
        //同步到系统员工
        request.body = { data: addSysStaffData };
        let func = extrequire("GT34544AT7.common.baseOpenApi");
        let sysStaff = func.execute(request).res;
      } else if (ownStaffStatus === "Update" && ownMainJobStatus === "Insert") {
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
              addSysStaffData.code = ownStaff.sysStaffCode;
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
        let MainJobList0 = {};
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
            case "_status":
              MainJobList0._status = ownMainJobList._status;
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
              break;
            case "Position":
              MainJobList0.post_id = ownMainJobRes.Position;
              break;
            case "job":
              MainJobList0.job_id = ownMainJobList.job;
              break;
            case "Posts":
              MainJobList0.new_post_id = ownMainJobList.Posts; //职位
          }
        }
        MainJobList.push(MainJobList0);
        //同步到系统员工
        addSysStaffData.mainJobList = MainJobList;
        request.body = { data: addSysStaffData };
        let func = extrequire("GT34544AT7.common.baseOpenApi");
        let sysStaff = func.execute(request).res;
        if (sysStaff.code === "999") {
          throw new Error("保存员工信息失败！44444\n" + sysStaff.message);
        }
        //回写数据到gxs员工
        var object = { id: paramReturn.id, isJob: "1" };
        var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
        let mainJobList = sysStaff.data.mainJobList;
        let sysMainJobId = "";
        for (let i = 0; i < mainJobList.length; i++) {
          if (mainJobList[i].enddate === undefined) {
            sysMainJobId = mainJobList[i].id;
          }
        }
        //回写数据到任职子表
        var hxstaffobject = { id: paramReturn.gxsStaffMainJobList[0].id, isOnJob: "1", txtID: paramReturn.gxsStaffMainJobList[0].id, sysMainJobId: sysMainJobId };
        var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });