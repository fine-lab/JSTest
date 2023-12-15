let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let username = "李四";
    let id = param.data[0].id;
    //调用费控开放API查询当前通用报销单详细信息
    let body = {};
    let url = "https://www.example.com/" + id;
    let res = openLinker("GET", url, "RBSM", JSON.stringify(body));
    var apiResponse = JSON.parse(res);
    if (apiResponse.code !== "200") {
      throw new Error("报销单查询失败：" + apiResponse.message);
    }
    var mailReceiver2 = ["https://www.example.com/"];
    var channels2 = ["mail"];
    var content2 = JSON.stringify(apiResponse);
    var messageInfo2 = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver2,
      channels: channels2,
      subject: "报销单审批参数2",
      content: content2
    };
    var result2 = sendMessage(messageInfo2);
    //调用费控保存API更新数据
    let body1 = {
      data: {
        resubmitCheckKey: id,
        vhandledeptid: apiResponse.data.vhandledeptid,
        chandleorg: apiResponse.data.chandleorg,
        nshouldpaymny: apiResponse.data.nshouldpaymny,
        id: id,
        dnatexchratedate: apiResponse.data.dnatexchratedate, //
        nnatbaseexchrate: apiResponse.data.nnatbaseexchrate, //
        nnatexchrate: apiResponse.data.nnatexchrate, //
        dcostdate: apiResponse.data.dcostdate,
        caccountorg: apiResponse.data.caccountorg,
        vnatcurrency: apiResponse.data.vnatcurrency,
        pk_handlepsn: apiResponse.data.pk_handlepsn,
        vcurrency: apiResponse.data.vcurrency,
        vouchdate: apiResponse.data.vouchdate,
        cfinaceorg: apiResponse.data.cfinaceorg,
        vreason: apiResponse.data.vreason,
        vfinacedeptid: apiResponse.data.vfinacedeptid,
        nexpensemny: apiResponse.data.nexpensemny,
        bustype: apiResponse.data.bustype,
        nsummny: apiResponse.data.nsummny,
        nnatshouldpaymny: apiResponse.data.nnatshouldpaymny,
        vnatexchratetype: apiResponse.data.vnatexchratetype,
        nnatexpensemny: apiResponse.data.nnatexpensemny,
        nnatsummny: apiResponse.data.nnatsummny,
        expsettleinfos: [
          {
            id: apiResponse.data.expsettleinfos[0].id,
            vbankaccname: apiResponse.data.expsettleinfos[0].vbankaccname,
            vsettlecurrency: apiResponse.data.expsettleinfos[0].vsettlecurrency,
            nsettlesummny: apiResponse.data.expsettleinfos[0].nsettlesummny,
            vbankaccount: apiResponse.data.expsettleinfos[0].vbankaccount,
            balatypesrvattr: apiResponse.data.expsettleinfos[0].balatypesrvattr,
            nnatsettlesummny: apiResponse.data.expsettleinfos[0].nnatsettlesummny,
            vnatcurrency: apiResponse.data.expsettleinfos[0].vnatcurrency,
            nnatexchrate: apiResponse.data.expsettleinfos[0].nnatexchrate,
            vcurrency: apiResponse.data.expsettleinfos[0].vcurrency,
            pk_banktype: apiResponse.data.expsettleinfos[0].pk_banktype,
            igathertype: apiResponse.data.expsettleinfos[0].igathertype,
            nsummny: apiResponse.data.expsettleinfos[0].nsummny,
            centerpriseorg: apiResponse.data.expsettleinfos[0].centerpriseorg,
            _status: "Update"
          }
        ],
        expapportions: [
          {
            id: apiResponse.data.expapportions[0].id,
            cfinaceorg: apiResponse.data.expapportions[0].cfinaceorg,
            nnatapportmny: apiResponse.data.expapportions[0].nnatapportmny,
            napportnotaxmny: apiResponse.data.expapportions[0].napportnotaxmny,
            vfinacedeptid: apiResponse.data.expapportions[0].vfinacedeptid,
            caccountorg: apiResponse.data.expapportions[0].caccountorg,
            nnatapportnotaxmny: apiResponse.data.expapportions[0].nnatapportnotaxmny,
            napportmny: apiResponse.data.expapportions[0].napportmny,
            _status: "Update"
          }
        ],
        expensebillbs: [
          {
            id: apiResponse.data.expensebillbs[0].id,
            vhandledeptid: apiResponse.data.expensebillbs[0].vhandledeptid,
            chandleorg: apiResponse.data.expensebillbs[0].chandleorg,
            nshouldpaymny: apiResponse.data.expensebillbs[0].nshouldpaymny,
            caccountorg: apiResponse.data.expensebillbs[0].caccountorg,
            vnatcurrency: apiResponse.data.expensebillbs[0].vnatcurrency,
            nnatexchrate: apiResponse.data.expensebillbs[0].nnatexchrate,
            pk_handlepsn: apiResponse.data.expensebillbs[0].pk_handlepsn,
            npaymentmny: apiResponse.data.expensebillbs[0].npaymentmny,
            nnatpaymentmny: apiResponse.data.expensebillbs[0].nnatpaymentmny,
            vcurrency: apiResponse.data.expensebillbs[0].vcurrency,
            cfinaceorg: apiResponse.data.expensebillbs[0].cfinaceorg,
            nnatbaseexchrate: apiResponse.data.expensebillbs[0].nnatbaseexchrate,
            vfinacedeptid: apiResponse.data.expensebillbs[0].vfinacedeptid,
            nexpensemny: apiResponse.data.expensebillbs[0].nexpensemny,
            nsummny: apiResponse.data.expensebillbs[0].nsummny,
            dnatexchratedate: apiResponse.data.expensebillbs[0].dnatexchratedate,
            nnatshouldpaymny: apiResponse.data.expensebillbs[0].nnatshouldpaymny,
            vnatexchratetype: apiResponse.data.expensebillbs[0].vnatexchratetype,
            nnatexpensemny: apiResponse.data.expensebillbs[0].nnatexpensemny,
            nnatsummny: apiResponse.data.expensebillbs[0].nnatsummny,
            _status: "Update"
          }
        ],
        expensebilluserdefs: {
          define53: username,
          id: id
        },
        _status: "Update"
      }
    };
    var mailReceiver3 = ["https://www.example.com/"];
    var channels3 = ["mail"];
    var content3 = JSON.stringify(body1);
    var messageInfo3 = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver3,
      channels: channels3,
      subject: "报销单审批参数3",
      content: content3
    };
    var result3 = sendMessage(messageInfo3);
    let saveurl = "https://www.example.com/";
    let apiResult = openLinker("POST", saveurl, "RBSM", JSON.stringify(body1));
    var apiResultResponse = JSON.parse(res);
    if (apiResultResponse.code !== "200") {
      throw new Error("报销单更新共享初审人失败：" + apiResultResponse.message);
    }
    var mailReceiver4 = ["https://www.example.com/"];
    var channels4 = ["mail"];
    var messageInfo4 = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver4,
      channels: channels4,
      subject: "报销单审批参数4",
      content: apiResultResponse
    };
    var result4 = sendMessage(messageInfo4);
    return {};
  }
}
exports({ entryPoint: MyTrigger });