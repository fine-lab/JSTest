let rukubustype = "1826219415820042242"; //其他入库交易类型
let chukubustype = "1826219767984291845"; //其他出库交易类型
viewModel.get("button89cd") &&
  viewModel.get("button89cd").on("click", function (data) {
    //作废--单击
    let othindata = viewModel.getAllData();
    let othinmainid = othindata.othinmainid;
    if (!isEmpty(othinmainid)) {
      let queryres = cb.rest.invokeFunction("AT195843BC09780006.apifun.quOthinAudit", { othinmainid }, function (err, res) {}, viewModel, { async: false });
      if (queryres.hasOwnProperty("result") && queryres.result.hasOwnProperty("auditres") && queryres.result.auditres.length > 0) {
        let code = queryres.result.auditres[0].code;
        cb.utils.alert("请先弃审单据号是【" + code + "】的其他入库单");
      } else {
        let result = cb.rest.invokeFunction("AT195843BC09780006.apifun.aftecancel", { othindata: othindata, rewriteorcancel: "CANCEL" }, function (err, res) {}, viewModel, { async: false });
        viewModel.execute("refresh");
      }
    }
  });
viewModel.on("beforeWorkflow", function (args) {
  let othindata = viewModel.getAllData();
  let verifystate = othindata.verifystate;
  let cancel = othindata.cancel;
  if ("2" == verifystate && "1" == cancel) {
    cb.utils.alert("已作废单据不允许审批撤回!");
    return false;
  }
});
viewModel.on("afterWorkflow", function (args) {
  let othindata = viewModel.getAllData();
  let verifystate = othindata.verifystate;
  let cancel = othindata.cancel;
  if ("2" == verifystate && "0" == cancel) {
    setTimeout(function () {
      let othinresult = processmethod(othindata);
      viewModel.execute("refresh");
    }, 500);
  }
  viewModel.execute("refresh");
});
viewModel.on("beforeSave", function (args) {
  let uidata = viewModel.getAllData();
  let checkflag = isCheck(uidata);
  if (checkflag) {
    cb.utils.alert("【项目】+【物料】不唯一!");
    return false;
  }
  var returnPromise = new cb.promise();
  cb.utils.confirm(
    "是否已检查【项目】、【物料】、【数量】值的准确性？",
    function () {
      return returnPromise.resolve();
    },
    function () {
      returnPromise.reject();
    }
  );
  return returnPromise;
});
function isCheck(data) {
  let flag = false;
  let projectproductmap = new Map();
  let sum = 1;
  if (data.hasOwnProperty("applyTlRecordsList")) {
    let viewrecords = data.applyTlRecordsList;
    for (let i = 0; i < viewrecords.length; i++) {
      let viewrecord = viewrecords[i];
      let project = viewrecord.project;
      let product = viewrecord.product;
      let key = project + "@@" + product;
      if (null != projectproductmap.get(key)) {
        flag = true;
        break;
      } else {
        projectproductmap.set(key, sum);
      }
    }
  }
  return flag;
}
function getOthInRecords(clonedata) {
  let viewrecords = clonedata.applyTlRecordsList;
  let newviewrecords = new Array();
  if (viewrecords.length > 0) {
    for (let i = 0; i < viewrecords.length; i++) {
      let viewrecord = viewrecords[i];
      let project = viewrecord.project;
      let product = viewrecord.product;
      let rkqty = viewrecord.qty;
      let querydatas = null;
      let otherqty = 0;
      let costpriceresult = cb.rest.invokeFunction(
        "ST.othinout.queryCostprice",
        { product: product, project: project, bustype: chukubustype, qty: rkqty, otherqty: otherqty },
        function (err, res) {},
        viewModel,
        { async: false }
      );
      if (costpriceresult.hasOwnProperty("result") && costpriceresult.result.hasOwnProperty("querydata")) {
        querydatas = costpriceresult.result.querydata;
      }
      if (null != querydatas && querydatas.length > 0) {
        let sytotalamount = 0;
        for (let j = 0; j < querydatas.length; j++) {
          let clonejsondata = JSON.parse(JSON.stringify(viewrecord));
          let quertdataqty = querydatas[j].qty;
          clonejsondata.qty = quertdataqty.toFixed(2);
          clonejsondata.subQty = (quertdataqty / clonejsondata.invExchRate).toFixed(2);
          let natUnitPrice1 = querydatas[j].natUnitPrice;
          clonejsondata.natUnitPrice = natUnitPrice1.toFixed(2);
          let natmoney1 = querydatas[j].natMoney;
          clonejsondata.natMoney = natmoney1.toFixed(2);
          clonejsondata.sourceautoid = querydatas[j].sourceautoid;
          clonejsondata.firstsourceid = querydatas[j].firstsourceid;
          clonejsondata.lineno = (newviewrecords.length + 1) * 10;
          clonejsondata.rowno = newviewrecords.length + 1;
          clonejsondata.autoCalcCost = false;
          clonejsondata.isUpdateCost = true;
          clonejsondata._status = "Insert";
          newviewrecords.push(clonejsondata);
          sytotalamount = sytotalamount + querydatas[j].qty;
        }
        if (rkqty > sytotalamount) {
          let newclonejson = JSON.parse(JSON.stringify(viewrecord));
          newclonejson.qty = (rkqty - sytotalamount).toFixed(2);
          newclonejson.subQty = ((rkqty - sytotalamount) / newclonejson.invExchRate).toFixed(2);
          newclonejson.lineno = (newviewrecords.length + 1) * 10;
          newclonejson.rowno = newviewrecords.length + 1;
          newclonejson.autoCalcCost = true;
          newclonejson.isUpdateCost = true;
          newclonejson._status = "Insert";
          newviewrecords.push(newclonejson);
        }
      } else {
        viewrecord.autoCalcCost = true;
        viewrecord.isUpdateCost = true;
        viewrecord.subQty = (viewrecord.qty / viewrecord.invExchRate).toFixed(2);
        viewrecord.lineno = (newviewrecords.length + 1) * 10;
        viewrecord.rowno = newviewrecords.length + 1;
        viewrecord._status = "Insert";
        newviewrecords.push(viewrecord);
      }
    }
  }
  return newviewrecords;
}
function getOthInRecordsdata(origviewrecords) {
  let mapmap = new Map();
  let newchilds1 = new Array();
  let newchilds2 = new Array();
  origviewrecords.forEach((selectdata) => {
    if (!selectdata.hasOwnProperty("firstsourceid") || isEmpty(selectdata.firstsourceid)) {
      newchilds1.push(selectdata);
    } else {
      newchilds2.push(selectdata);
    }
  });
  if (newchilds1.length > 0) {
    mapmap.set("ONE", newchilds1);
  }
  if (newchilds2.length > 0) {
    mapmap.set("TWO", newchilds2);
  }
  return mapmap;
}
function processmethod(applydata) {
  let childs = getOthInRecords(applydata);
  let mapchild = getOthInRecordsdata(childs);
  let temp2 = null;
  let temp1 = null;
  if (null != mapchild && mapchild.size > 0) {
    temp1 = mapchild.get("ONE");
    temp2 = mapchild.get("TWO");
  }
  if (null != temp2 && temp2.length > 0) {
    if (null != temp1 && temp1.length > 0) {
      let newchilds2 = getnewchilds(temp1, true);
      let othintemp = saveOthin(applydata, newchilds2, "Insert", false);
      setTimeout(function () {
        if (null != othintemp) {
          let allchilds = getalldatchilds(null, temp2);
          let othinresult = saveOthin(othintemp, allchilds, "Update", true);
          if (null != othinresult) updateOthout(othinresult);
        }
      }, 500);
    } else {
      let arraytemp = null;
      let newchilds2 = getalldatchilds(arraytemp, temp2);
      let othinresult = saveOthin(applydata, newchilds2, "Insert", false);
      if (null != othinresult) updateOthout(othinresult);
    }
  } else {
    if (null != temp1 && temp1.length > 0) {
      let newchilds2 = getnewchilds(temp1, true);
      saveOthin(applydata, newchilds2, "Insert", false);
    }
  }
}
function getalldatchilds(othinresult, insertchilds) {
  let newchilds = new Array();
  insertchilds.forEach((child) => {
    child.lineno = (newchilds.length + 1) * 10;
    child.rowno = newchilds.length + 1;
    newchilds.push(child);
  });
  if (null != othinresult) {
    let origviewrecords = othinresult.othInRecords;
    origviewrecords.forEach((selectdata) => {
      delete selectdata.inventoryowner;
      delete selectdata.reserveid;
      selectdata._status = "Update";
      newchilds.push(selectdata);
    });
  }
  return newchilds;
}
function getnewchilds(tempchilds, isupdateflag) {
  let newchilds2 = new Array();
  tempchilds.forEach((selectdata) => {
    newchilds2.push(selectdata);
  });
  return newchilds2;
}
function saveOthin(applydata, childs, status, flag) {
  let othinresult = null;
  let body = {};
  if (flag) {
    delete applydata.postAccountVersion;
    applydata.resubmitCheckKey = getResubmitCheckKey();
    applydata._status = "Update";
    applydata.othInRecords = childs;
    body = {
      data: applydata
    };
  } else {
    body = getinsertBodydata(applydata, childs, status);
    if (applydata.hasOwnProperty("stockMgr")) {
      body.data.stockMgr = applydata.stockMgr;
    }
    if (applydata.hasOwnProperty("operator")) {
      body.data.operator = applydata.operator;
    }
    if (applydata.hasOwnProperty("department")) {
      body.data.department = applydata.department;
    }
    if (applydata.hasOwnProperty("memo")) {
      body.data.memo = applydata.memo;
    }
  }
  let saveresult = cb.rest.invokeFunction("ST.othinout.saveotherin", { body: body, othinstatus: "OTHININSERT", othindata: applydata }, function (err, res) {}, viewModel, { async: false });
  if (saveresult.hasOwnProperty("result") && saveresult.result.hasOwnProperty("othinresult")) {
    othinresult = saveresult.result.othinresult;
  }
  return othinresult;
}
function updateOthout(othindata) {
  let billdata = {
    aftersave: othindata
  };
  let result = cb.rest.invokeFunction("AT195843BC09780006.apifun.updateOthOut", { billdata }, function (err, res) {});
}
function getResubmitCheckKey() {
  let resubmitCheckKey = newPseudoGuid();
  return resubmitCheckKey;
}
function newPseudoGuid() {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
  }
  return guid;
}
function getinsertBodydata(requestData, othInRecords, status) {
  let bodys = {
    data: {
      resubmitCheckKey: getResubmitCheckKey(),
      org: requestData.org_id,
      accountOrg: requestData.org_id,
      vouchdate: getdate(),
      bustype: rukubustype,
      warehouse: requestData.warehouse,
      _status: status,
      othInRecords: othInRecords
    }
  };
  return bodys;
}
function getdate() {
  //去当前时间
  var timezone = 8; //目标时区时间，东八区
  var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
  var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
  var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
  let year = date.getFullYear();
  var month = date.getMonth() + 1; // 获取月
  var strDate = date.getDate(); // 获取日
  var hour = date.getHours(); // 获取小时
  var minute = date.getMinutes(); // 获取分钟
  var second = date.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (strDate < 10) {
    strDate = "0" + strDate;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }
  date = year + "-" + month + "-" + strDate + " " + hour + ":" + minute + ":" + second;
  return date;
}
function isEmpty(jsonvalue) {
  let flag = false;
  if (undefined == jsonvalue || null == jsonvalue || "" == jsonvalue || "undefined" == jsonvalue) {
    flag = true;
  }
  return flag;
}
viewModel.get("button38wg") &&
  viewModel.get("button38wg").on("click", function (data) {
    //审核--单击
    setTimeout(function () {
      let othindata = viewModel.getAllData();
      let cancel = othindata.cancel;
      if ("0" == cancel) {
        let othinresult = processmethod(othindata);
        viewModel.execute("refresh");
      }
    }, 500);
    viewModel.execute("refresh");
  });
viewModel.get("button63xh") &&
  viewModel.get("button63xh").on("click", function (data) {
    //弃审--单击
    setTimeout(function () {
      let othindata = viewModel.getAllData();
      let verifystate = othindata.verifystate;
      let cancel = othindata.cancel;
      if ("2" == verifystate && "1" == cancel) {
        cb.utils.alert("已作废单据不可弃审!");
        return false;
      } else {
        let othinmainid = othindata.othinmainid;
        if (!isEmpty(othinmainid)) {
          let queryres = cb.rest.invokeFunction("AT195843BC09780006.apifun.quOthinAudit", { othinmainid }, function (err, res) {}, viewModel, { async: false });
          if (queryres.hasOwnProperty("result") && queryres.result.hasOwnProperty("auditres") && queryres.result.auditres.length > 0) {
            let code = queryres.result.auditres[0].code;
            cb.utils.alert("请先弃审单据号是【" + code + "】的其他入库单");
          } else {
            let result = cb.rest.invokeFunction("AT195843BC09780006.apifun.aftecancel", { othindata: othindata, rewriteorcancel: "UNADUIT" }, function (err, res) {}, viewModel, { async: false });
            viewModel.execute("refresh");
          }
        }
      }
    }, 500);
  });
viewModel.on("afterSave", function (args) {
  let mainid = args.res.id;
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "Voucher",
      params: {
        id: mainid,
        mode: "browse",
        readOnly: true,
        domainKey: viewModel.getDomainKey()
      },
      billno: "tuiliaoapply"
    },
    viewModel.getCache("parentViewModel")
  );
});