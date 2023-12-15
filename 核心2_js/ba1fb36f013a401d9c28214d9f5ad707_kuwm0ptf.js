let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let type = request.type;
    let code = request.code;
    let sql =
      "select id ,code ,name ,d.name as lyname, default_license ,type ,price ,b.id as bid,b.left as left,b.right as right,b.price as bprice,c.id as cid,c.relay_module as relay_id,c.relay_module_name as relay_name,dr ,b.dr as bdr,c.dr as cdr from AT18E626C409D80003.AT18E626C409D80003.module left join AT18E626C409D80003.AT18E626C409D80003.license_price_rule b on id = b.module_id " +
      " left join AT18E626C409D80003.AT18E626C409D80003.relay_module c on id = c.module_id " +
      "  left join AT18E626C409D80003.AT18E626C409D80003.lingyu d on lingyu = d.id where dr = 0 and (b.dr = 0 or b.dr is null ) and (c.dr = 0 or c.dr is null)";
    if (type != undefined && type != "") {
      sql = sql + " and type = " + type;
    }
    if (code != undefined && code != "") {
      sql = sql + " and code = " + code;
    }
    sql = sql + " limit 2000 "; //理论上来说应该没有2000个模块
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
      let price_arr = [];
      let price_ids = new Set();
      let relay_arr = [];
      let relay_ids = new Set();
      for (let i = 0; i < list.length; i++) {
        let m_1 = list[i];
        let price_id = m_1.bid;
        let relay_id = m_1.cid;
        if (!price_ids.has(price_id)) {
          price_ids.add(price_id);
          let pri = {};
          pri.left = m_1.left;
          pri.right = m_1.right;
          pri.price = m_1.bprice;
          price_arr.push(pri);
        }
        if (!relay_ids.has(relay_id)) {
          relay_ids.add(relay_id);
          let relay = {};
          relay.relay_id = m_1.relay_id;
          relay.relay_name = m_1.relay_name;
          relay_arr.push(relay);
        }
      }
      module.price_arr = price_arr;
      module.relay_arr = relay_arr;
      let min = m.default_license + 1;
      let max = -1;
      for (let i = 0; i < price_arr.length; i++) {
        let p = price_arr[i];
        if (p.right > max) {
          max = p.right;
        }
      }
      module.min = min;
      if (max != -1) {
        module.max = max;
      }
      arr.push(module);
    });
    return { res: arr };
  }
}
exports({ entryPoint: MyAPIHandler });