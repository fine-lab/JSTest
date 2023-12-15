let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let product = request.product;
    let project = request.project;
    let bustype = request.bustype;
    let rukuqty = request.qty; //入库数量
    let otherqty = request.otherqty; //表体项目+产品已存在数量
    let querydata = getSonMountArray(product, project, rukuqty, otherqty, bustype);
    function getMainResIds(bustype) {
      let mainquerycondition = "";
      if ("" != bustype) {
        mainquerycondition = " and bustype='" + bustype + "'";
      }
      let mainsql = "select id from st.othoutrecord.OthOutRecord where status=1 " + mainquerycondition;
      var res = ObjectStore.queryByYonQL(mainsql, "ustock");
      let ids = new Array();
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          ids.push(res[i].id);
        }
      }
      return ids;
    }
    function getSonMountArray(product, project, rukuqty, otherqty, bustype) {
      let projectproductArray = new Array();
      let insql = getInwheresql(bustype);
      if (insql.length > 0) {
        let sonwheresql = "  where product='" + product + "' and project='" + project + "' ";
        if (undefined != insql && insql.length > 0) {
          sonwheresql = sonwheresql + " and mainid in(" + insql + ")";
        }
        let sonsql = "select *  from st.othoutrecord.OthOutRecords  " + sonwheresql + " order  by  recorddate	 desc";
        var res = ObjectStore.queryByYonQL(sonsql, "ustock");
        if (res.length > 0) {
          let totalamount = 0;
          for (let i = 0; i < res.length; i++) {
            let qty = res[i].qty;
            let a02 = 0;
            if (res[i].hasOwnProperty("othOutRecordsDefineCharacter") && res[i].othOutRecordsDefineCharacter.hasOwnProperty("a01")) {
              if (!res[i].othOutRecordsDefineCharacter.a01) {
                if (res[i].othOutRecordsDefineCharacter.hasOwnProperty("a02")) {
                  a02 = res[i].othOutRecordsDefineCharacter.a02;
                }
              } else {
                a02 = qty;
              }
            }
            let shengyurukuqty = qty - a02;
            if (otherqty == 0) {
              if (rukuqty <= totalamount + shengyurukuqty) {
                let subqty = rukuqty - totalamount;
                let tempjson = getotheroutrecordjson(res[i], subqty);
                projectproductArray.push(tempjson);
                break;
              } else {
                if (shengyurukuqty > 0) {
                  totalamount = totalamount + shengyurukuqty;
                  let tempjson = getotheroutrecordjson(res[i], shengyurukuqty);
                  projectproductArray.push(tempjson);
                }
              }
            } else {
              if (otherqty >= shengyurukuqty) {
                otherqty = otherqty - shengyurukuqty;
              } else {
                let shengyu1 = shengyurukuqty - otherqty;
                if (shengyu1 > rukuqty) {
                  let tempjson = getotheroutrecordjson(res[i], rukuqty);
                  projectproductArray.push(tempjson);
                  break;
                } else {
                  totalamount = totalamount + shengyu1;
                  let tempjson = getotheroutrecordjson(res[i], shengyu1);
                  projectproductArray.push(tempjson);
                }
                otherqty = 0;
              }
            }
          }
        }
      }
      return projectproductArray;
    }
    function getotheroutrecordjson(res, qty) {
      let natUnitPrice = res.hasOwnProperty("natUnitPrice") ? res.natUnitPrice : 0;
      let result = {
        qty: qty,
        sourceautoid: res.id,
        firstsourceid: res.mainid,
        natUnitPrice: natUnitPrice,
        natMoney: qty * natUnitPrice,
        subQty: qty / res.invExchRate
      };
      return result;
    }
    function getInwheresql(bustype) {
      let insql = "";
      let ids = getMainResIds(bustype);
      if (ids.length > 0) {
        for (let i = 0; i < ids.length; i++) {
          let id = ids[i];
          insql = insql + "'" + id + "',";
        }
        insql = insql.substring(0, insql.length - 1);
      }
      return insql;
    }
    return { querydata };
  }
}
exports({ entryPoint: MyAPIHandler });