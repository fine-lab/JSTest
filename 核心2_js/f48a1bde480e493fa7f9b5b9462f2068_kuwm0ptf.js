let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let type = request.type;
    let sql =
      "select id,code ,ly_name as lyname,app,name,price,type,default_license,relay,relay_id,max,min,sale_calcu_type,b.left as left,b.right as right,b.id as bid,b.price as bprice,c.id as cid,c.relay as cr from GT6990AT161.GT6990AT161.sale_modules left join GT6990AT161.GT6990AT161.ladder_price b on id = b.sale_modules_id " +
      " left join GT6990AT161.GT6990AT161.relay_ms c on id = c.sale_modules_id   " +
      " where  dr = 0 and (b.dr = 0 or b.dr is null ) and (c.dr = 0 or c.dr is null)";
    if (type != undefined && type != "") {
      sql = sql + " and type = " + type;
    }
    sql = sql + " order by type ,order ,b.left limit 8000 "; //理论上来说应该没有8000个模块
    var res = ObjectStore.queryByYonQL(sql);
    var map = new Map();
    for (let i = 0; i < res.length; i++) {
      let m = res[i];
      let id = m.id;
      let arr = [];
      if (map.has(id)) {
        arr = map.get(id);
      }
      arr.push(m);
      map.set(id, arr);
    }
    let arr = [];
    map.forEach(function (list, id) {
      let m = list[0];
      let module = {};
      module.id = m.id;
      module.code = m.code;
      module.name = m.name;
      module.lyname = m.lyname;
      module.default_license = m.default_license;
      module.type = m.type;
      module.price = m.price;
      module.relay = m.relay;
      module.max = m.max;
      module.min = m.min;
      module.sale_calcu_type = m.sale_calcu_type;
      module.relay_id = m.relay_id;
      module.xks = undefined;
      let price_arr = [];
      let relay_arr = [];
      let price_ids = new Set();
      let relay_ids = new Set();
      for (let i = 0; i < list.length; i++) {
        let m_1 = list[i];
        let price_id = m_1.bid;
        if (!price_ids.has(price_id)) {
          price_ids.add(price_id);
          let pri = {};
          pri.left = m_1.left;
          pri.right = m_1.right;
          pri.price = m_1.bprice;
          price_arr.push(pri);
        }
        let cid = m_1.cid;
        if (!relay_ids.has(cid)) {
          relay_ids.add(cid);
          let cr = m_1.cr;
          relay_arr.push(cr);
        }
      }
      module.price_arr = price_arr;
      module.relay_arr = relay_arr;
      arr.push(module);
    });
    return {
      code: 200,
      data: {
        result: arr
      }
    };
  }
}
exports({ entryPoint: MyAPIHandler });