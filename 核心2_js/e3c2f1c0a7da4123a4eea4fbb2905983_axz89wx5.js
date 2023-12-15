let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.hasOwnProperty("othindata")) {
      let othInRecords = param.othindata;
      if (othInRecords.length > 0) {
        otherInRecordProcess(othInRecords);
      }
    }
    function otherInRecordProcess(othInRecords) {
      let otherinmap = new Map();
      let otherOutids = new Array();
      let strotheroutids = "";
      for (let i = 0; i < othInRecords.length; i++) {
        let othInRecord = othInRecords[i];
        let product = othInRecord.product;
        let qty = othInRecord.qty;
        let project = othInRecord.project;
        let sourceid = othInRecord.hasOwnProperty("firstsourceid") ? othInRecord.firstsourceid : "";
        let sourceautoid = othInRecord.hasOwnProperty("sourceautoid") ? othInRecord.sourceautoid : "";
        let othinkey = sourceid + "##" + sourceautoid + "##" + project + "##" + product;
        if (undefined != sourceid && "" != sourceid && null != sourceid) {
          if (null != otherinmap.get(othinkey)) {
            let tempqty = otherinmap.get(othinkey);
            otherinmap.set(othinkey, qty + tempqty);
          } else {
            otherinmap.set(othinkey, qty);
          }
          otherOutids.push(sourceid);
          strotheroutids = strotheroutids + "'" + sourceid + "',";
        }
      }
      if (otherOutids.length > 0) {
        let otherOuts = getOtherOutBYsql(strotheroutids);
        let recordmap = getOtherOutRecoedsBYsql(strotheroutids);
        if (otherOuts.length > 0) {
          let updataotherOuts = new Array();
          for (let j = 0; j < otherOuts.length; j++) {
            let otherOut = otherOuts[j];
            let updatarecords = new Array();
            let OthOutRecords = recordmap.get(otherOut.id);
            for (let k = 0; k < OthOutRecords.length; k++) {
              let OthOutRecord = OthOutRecords[k];
              delete OthOutRecord.reserveid;
              delete OthOutRecord.inventoryowner;
              OthOutRecord._status = "Update";
              let mainid = OthOutRecord.mainid;
              let id = OthOutRecord.id;
              let project = OthOutRecord.hasOwnProperty("project") ? OthOutRecord.project : "";
              let product = OthOutRecord.product;
              let othoutkey = mainid + "##" + id + "##" + project + "##" + product;
              if (null != otherinmap.get(othoutkey)) {
                OthOutRecord._status = "Update";
                let inStockAmount = getInStockAmount(OthOutRecord); //其它出库特征已入库数量
                let a02 = inStockAmount - otherinmap.get(othoutkey) < 0 ? 0 : inStockAmount - otherinmap.get(othoutkey);
                if (OthOutRecord.hasOwnProperty("othOutRecordsDefineCharacter")) {
                  OthOutRecord.othOutRecordsDefineCharacter.a01 = false;
                  OthOutRecord.othOutRecordsDefineCharacter.a02 = a02;
                  OthOutRecord.othOutRecordsDefineCharacter.id = id;
                } else {
                  let othOutRecordsDefineCharacter = {
                    a01: false,
                    a02: a02,
                    id: id
                  };
                  OthOutRecord.othOutRecordsDefineCharacter = othOutRecordsDefineCharacter;
                }
                updatarecords.push(OthOutRecord);
              } else {
                updatarecords.push(OthOutRecord);
              }
            }
            if (updatarecords.length > 0) {
              otherOut.resubmitCheckKey = getResubmitCheckKey();
              otherOut._status = "Update";
              otherOut.othOutRecords = updatarecords;
              updataotherOuts.push(otherOut);
            }
          }
          if (updataotherOuts.length > 0) {
            let func1 = extrequire("ST.otherOutRecord.getUrlHead");
            let urlres = func1.execute(null, null);
            let otherouturl = urlres.urlHead + "/yonbip/scm/othoutrecord/single/save";
            for (let m = 0; m < updataotherOuts.length; m++) {
              let body = {
                data: updataotherOuts[m]
              };
              let apiResponse = openLinker("POST", otherouturl, "ST", JSON.stringify(body));
            }
          }
        }
      }
    }
    function getInStockAmount(OthOutRecord) {
      let inStockAmount = 0;
      if (OthOutRecord.hasOwnProperty("othOutRecordsDefineCharacter")) {
        if (OthOutRecord.othOutRecordsDefineCharacter.hasOwnProperty("a02")) {
          inStockAmount = OthOutRecord.othOutRecordsDefineCharacter.a02;
        }
      }
      return inStockAmount;
    }
    function getOtherOutRecoeds(ids) {
      var object = {
        ids: ids,
        compositions: [
          {
            name: "othOutRecords"
          }
        ]
      };
      return ObjectStore.selectBatchIds("st.othoutrecord.OthOutRecord", object);
    }
    function getOtherOutRecoedsBYsql(strotheroutids) {
      let recordsmap = new Map();
      let ids = substring(strotheroutids, 0, strotheroutids.length - 1);
      let sql = "select * from st.othoutrecord.OthOutRecords where mainid in(" + ids + ")";
      var res = ObjectStore.queryByYonQL(sql, "ustock");
      if (undefined != res && res.length > 0) {
        res.forEach((selectdata) => {
          let mainid = selectdata.mainid;
          if (null != recordsmap.get(mainid) && recordsmap.get(mainid).length > 0) {
            let recordsarray = recordsmap.get(mainid);
            recordsarray.push(selectdata);
            recordsmap.set(mainid, recordsarray);
          } else {
            let recordsarray = new Array();
            recordsarray.push(selectdata);
            recordsmap.set(mainid, recordsarray);
          }
        });
      }
      return recordsmap;
    }
    function getOtherOutBYsql(strotheroutids) {
      let ids = substring(strotheroutids, 0, strotheroutids.length - 1);
      let sql = "select * from st.othoutrecord.OthOutRecord where id in(" + ids + ")";
      var res = ObjectStore.queryByYonQL(sql, "ustock");
      return res;
    }
    function getResubmitCheckKey() {
      let resubmitCheckKey = replace(uuid(), "-", "");
      return resubmitCheckKey;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });