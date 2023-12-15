let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let selectrows = request.selectedData;
    let ids = new Array();
    let stores = "";
    let mainids = "";
    let needpushdata = new Array();
    for (let i = 0; i < selectrows.length; i++) {
      if (selectrows[i].hasOwnProperty("sourcesys") && "retail" == selectrows[i].sourcesys) {
        if (
          selectrows[i].hasOwnProperty("store") &&
          undefined != selectrows[i].store &&
          "" != selectrows[i].store &&
          "undefined" != selectrows[i].store &&
          "1597466579984973833" == selectrows[i].store
        ) {
          ids.push(selectrows[i].id);
          stores = stores + "'" + selectrows[i].store + "',";
          mainids = mainids + "'" + selectrows[i].id + "',";
        }
      }
    }
    if (mainids.length > 0) {
      needpushdata = getSelectDatas(ids, stores, mainids);
    }
    function getSelectDatas(ids, stores, mainids) {
      let resresult = new Array();
      let storemap = getStoresMap(stores);
      if (storemap.size == 0) {
        return resresult;
      }
      //查询内容
      var object = {
        ids: ids,
        compositions: [
          {
            name: "details"
          }
        ]
      };
      //实体查询
      let res = ObjectStore.selectBatchIds("st.salesout.SalesOut", object);
      if (undefined != res && res.length > 0) {
        let idmap = getsatteflag(mainids);
        for (let i = 0; i < res.length; i++) {
          let store = res[i].store;
          let id = res[i].id;
          if ("true" == storemap.get(store) && "成功" !== idmap.get(id)) {
            resresult.push(res[i]);
          }
        }
      }
      return resresult;
    }
    function getStoresMap(store) {
      let stores = store.substring(0, store.length - 1);
      let sql = "select * from 		aa.store.StoreCustomItem	where  id in(" + stores + ")";
      var res = ObjectStore.queryByYonQL(sql, "yxybase");
      let storemap = new Map();
      if (undefined != res && res.length > 0) {
        for (let j = 0; j < res.length; j++) {
          storemap.set(res[j].id, res[j].define1);
        }
      }
      return storemap;
    }
    function getsatteflag(ids) {
      let id = ids.substring(0, ids.length - 1);
      let sql = "select * from 		st.salesout.SalesOutDefine	where  id in(" + id + ")";
      var res = ObjectStore.queryByYonQL(sql, "ustock");
      let storemap = new Map();
      if (undefined != res && res.length > 0) {
        for (let j = 0; j < res.length; j++) {
          storemap.set(res[j].id, res[j].define1);
        }
      }
      return storemap;
    }
    return { needpushdata };
  }
}
exports({ entryPoint: MyAPIHandler });