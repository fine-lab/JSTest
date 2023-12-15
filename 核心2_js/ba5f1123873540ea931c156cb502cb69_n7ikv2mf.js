let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //预提单id
    var id = request.id;
    var isMobile = request.isMobile; //是否移动
    var result = {};
    //根据预提单id获取预提单详情
    var object = {
      id: id,
      compositions: [
        {
          name: "partnerList"
        },
        {
          name: "apply_outs_resource_reqFieldNewList"
        },
        {
          name: "apply_outs_resource_industryList"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT5258AT16.GT5258AT16.apply_outs_resource", object);
    result.res = res;
    function aa(p) {
      var uspaceReceiver = ["ea764084-6c48-43b7-8ba7-62a47a767034"];
      var channels = ["uspace"];
      var title = "测试";
      var content = p;
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: "yourIdHere",
        uspaceReceiver: uspaceReceiver,
        channels: channels,
        subject: title,
        content: content
      };
      var result = sendMessage(messageInfo);
    }
    aa(JSON.stringify(res.apply_outs_resource_industryList));
    var publicNum = res.publicNum;
    if (!publicNum) publicNum = 0;
    //设置时间带时分秒
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh;
      var mm;
      var ss;
      try {
        hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      } catch (e) {
        hh = "00";
      }
      try {
        mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      } catch (e) {
        mm = "00";
      }
      try {
        ss = date.getSeconds() < 10 ? "0" + date.getSeonds() : date.getSeconds();
      } catch (e) {
        ss = "00";
      }
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    var updateList = [];
    var d = new Date(); //创建一个Date对象
    var localTime = d.getTime();
    var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
    var gmt = localTime + localOffset; //GMT时间
    var offset = 8; //东8区
    var beijing = gmt + 3600000 * offset;
    var nd = new Date(beijing);
    var currentTime = formatDateTime(nd);
    var insertList = [];
    var hasPublic = function (sourcechild_id) {
      var dutyDatas = ObjectStore.selectByMap("GT5258AT16.GT5258AT16.duty_outs_resource", { sourcechild_id }, "8e14591f");
      if (dutyDatas && dutyDatas.length > 0 && dutyDatas[0].id) {
        return true;
      }
      return false;
    };
    //遍历预提单的伙伴明细
    var partnerList = res.partnerList;
    if (partnerList && partnerList.length > 0) {
      for (var num = 0; num < partnerList.length; num++) {
        var partner = partnerList[num];
        if ((isMobile && partner.linkManName == "郝凤尚") || !isMobile) {
          //如果未发布则生成反馈单，并且进行消息通知
          if (partner.isPublic != "Y" && !hasPublic(partner.id)) {
            var fkd = {
              billName: res.billName,
              billDate: res.billDate,
              linkman: res.linkman,
              position: res.position,
              mobile: res.mobile,
              projectName: res.projectName,
              isSignContract: res.isSignContract,
              projectArea: res.projectArea,
              prductPlatform: res.prductPlatform,
              busiDept: res.busiDept,
              reqContent: res.reqContent,
              reqContentName: res.reqContentName,
              reqDept: res.reqDept,
              reqField: res.reqField,
              expectDeliverTime: res.expectDeliverTime,
              expectEnterTime: res.expectEnterTime,
              deliveryTypes: res.deliveryTypes,
              cooperationMode: res.cooperationMode,
              isAcceptRemote: res.isAcceptRemote,
              personNum: res.personNum,
              expectPeriod: res.expectPeriod,
              workAmoun2: res.workAmount,
              field: res.field,
              hasWorkAssignment: res.hasWorkAssignment,
              attachment: res.attachment,
              detailDesc: res.detailDesc,
              responseStatus: "1",
              sourceOrg: res.org_id,
              sourceOrgName: res.orgName,
              sourceBillCode: res.code,
              source_id: res.id,
              sourcechild_id: partner.id,
              org_id: partner.partner,
              yhtUserid: partner.yhtUserid,
              email: partner.linkManEmail,
              partnerName: partner.partnerName,
              isClose: "N",
              affOrg: res.affOrg,
              affOrgName: res.affOrgName
            };
            var duty_outs_resource_industryList = [];
            if (res.apply_outs_resource_industryList && res.apply_outs_resource_industryList.length > 0) {
              for (var indi = 0; indi < res.apply_outs_resource_industryList.length; indi++) {
                var industry = {
                  industry: res.apply_outs_resource_industryList[indi].industry,
                  _status: "Insert"
                };
                duty_outs_resource_industryList.push(industry);
              }
            }
            var duty_outs_resource_reqFieldNewList = [];
            if (res.apply_outs_resource_reqFieldNewList && res.apply_outs_resource_reqFieldNewList.length > 0) {
              for (var rfni = 0; rfni < res.apply_outs_resource_reqFieldNewList.length; rfni++) {
                var reqFieldNew = {
                  reqFieldNew: res.apply_outs_resource_reqFieldNewList[rfni].reqFieldNew,
                  _status: "Insert"
                };
                duty_outs_resource_reqFieldNewList.push(reqFieldNew);
              }
            }
            fkd.duty_outs_resource_industryList = duty_outs_resource_industryList;
            fkd.duty_outs_resource_reqFieldNewList = duty_outs_resource_reqFieldNewList;
            insertList.push(fkd);
            updateList.push({ id: partner.id, isPublic: "Y", publicTime: currentTime, _status: "Update" });
          }
        }
      }
    }
    result.insertList = insertList;
    result.updateList = updateList;
    if (insertList.length > 0) {
      //批量插入反馈单
      var res222 = ObjectStore.insertBatch("GT5258AT16.GT5258AT16.duty_outs_resource", insertList, "8e14591f");
      result.insertRes = res222;
      publicNum = publicNum + 1;
      var updateObject = { id: id, isPublic: "Y", publicNum: publicNum, partnerList: updateList };
      var updRes = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource", updateObject, "c28d8f19");
      try {
        for (var num11 = 0; num11 < res222.length; num11++) {
          let sendMsgToPartner = extrequire("GT5258AT16.wbzyytd.sendMsgToPartner");
          let msgRes = sendMsgToPartner.execute({ id: res222[num11].id });
          result.msgRes = msgRes;
        }
      } catch (e) {}
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });