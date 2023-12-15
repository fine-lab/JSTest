let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pz = [];
    //删除凭证主表、明细表、视图中的所有内容
    //从采购单里取数据
    var cg = ObjectStore.queryByYonQL("select zth,sheetid,sheetdate,oper_code,code.code,oper_code,mone from AT1808958A17680009.AT1808958A17680009.JXC_SHEET_BUY_001");
    for (var prod of cg) {
      let zth = prod.zth;
      let sheetid = prod.sheetid;
      let rq = prod.sheetdate;
      let sheetdate1 = prod.sheetdate;
      let zdr = prod.oper_code;
      let code = prod.code_code;
      let mone = prod.mone;
      sheetdate1 = new Date(sheetdate1);
      let nkjqj = sheetdate1.getFullYear();
      let ykjqj = sheetdate1.getMonth() + 1;
      if (ykjqj >= 1 && ykjqj <= 9) {
        ykjqj = "0" + ykjqj;
      }
      let tax = 1.13;
      let km_code_jf1 = "1405";
      let jfje1 = mone / tax;
      let km_code_jf2 = "2221-01-01";
      let jfje2 = mone - jfje1;
      let km_code_df1 = "1002";
      let dfje1 = mone;
      let zy = "采购商品" + "[" + code + "]";
      let bz = "[机]" + "账套" + "[" + zth + "]" + "业务[jxc]类型[采购单]" + "单号" + "[" + sheetid + "]";
      jfje1 = jfje1.toFixed(2);
      jfje2 = jfje2.toFixed(2);
      dfje1 = dfje1.toFixed(2);
      const cg1 = {
        zth: zth,
        nkjqj: nkjqj,
        ykjqj: ykjqj,
        rq: rq,
        zdr: zdr,
        km_code_jf1: km_code_jf1,
        km_code_jf2: km_code_jf2,
        km_code_df1: km_code_df1,
        jfje1: jfje1,
        jfje2: jfje2,
        dfje1: dfje1,
        zy: zy,
        bz: bz
      };
      pz.push(cg1);
    }
    //从销售单里取数据
    var xs = ObjectStore.queryByYonQL("select zth,sheetid,sheetdate,oper_code,code.code,oper_code,mone from AT1808958A17680009.AT1808958A17680009.JXC_SHEET_SALE_001");
    for (var prod of xs) {
      let zth = prod.zth;
      let sheetid = prod.sheetid;
      let rq = prod.sheetdate;
      let sheetdate1 = prod.sheetdate;
      let zdr = prod.oper_code;
      let code = prod.code_code;
      let mone = prod.mone;
      sheetdate1 = new Date(sheetdate1);
      let nkjqj = sheetdate1.getFullYear();
      let ykjqj = sheetdate1.getMonth() + 1;
      if (ykjqj >= 1 && ykjqj <= 9) {
        ykjqj = "0" + ykjqj;
      }
      let tax = 1.13;
      let km_code_jf1 = "1002";
      let jfje1 = mone;
      let km_code_df1 = "6001";
      let km_code_df2 = "2221-01-02";
      let dfje1 = mone / 1.13;
      let dfje2 = mone - dfje1;
      let zy = "销售商品" + "[" + code + "]";
      let bz = "[机]" + "账套" + "[" + zth + "]" + "业务[jxc]类型[销售单]" + "单号" + "[" + sheetid + "]";
      jfje1 = jfje1.toFixed(2);
      dfje1 = dfje1.toFixed(2);
      dfje2 = dfje2.toFixed(2);
      const xs1 = {
        zth: zth,
        nkjqj: nkjqj,
        ykjqj: ykjqj,
        rq: rq,
        zdr: zdr,
        km_code_jf1: km_code_jf1,
        km_code_df1: km_code_df1,
        km_code_df2: km_code_df2,
        jfje1: jfje1,
        dfje1: dfje1,
        dfje2: dfje2,
        zy: zy,
        bz: bz
      };
      pz.push(xs1);
    }
    //从销售单里取数据（结转凭证）
    var xsjz = ObjectStore.queryByYonQL("select zth,sheetid,sheetdate,oper_code,code.code,oper_code,amount from AT1808958A17680009.AT1808958A17680009.JXC_SHEET_SALE_001");
    for (var prod of xsjz) {
      let zth = prod.zth;
      let sheetid = prod.sheetid;
      let rq = prod.sheetdate;
      let sheetdate1 = prod.sheetdate;
      let zdr = prod.oper_code;
      let code = prod.code_code;
      let amount = prod.amount;
      sheetdate1 = new Date(sheetdate1);
      let nkjqj = sheetdate1.getFullYear();
      let ykjqj = sheetdate1.getMonth() + 1;
      if (ykjqj >= 1 && ykjqj <= 9) {
        ykjqj = "0" + ykjqj;
      }
      let date1 = nkjqj + "-" + ykjqj;
      var cbdj = ObjectStore.queryByYonQL(
        "select price from AT1808958A17680009.AT1808958A17680009.JXC_GOODS_PRICE_001 where  zth='" + zth + "' and left(date_min,7)='" + date1 + "' and code='" + code + "'"
      );
      let price = cbdj[0]["price"];
      let km_code_jf1 = "6401";
      let jfje1 = price * amount;
      let km_code_df1 = "1405";
      let dfje1 = price * amount;
      let zy = "结转" + "商品" + "[" + code + "]" + "的销售成本";
      let bz = "[机]" + "账套" + "[" + zth + "]" + "业务[jxc]类型[销售单结转成本]" + "单号" + "[" + sheetid + "]";
      jfje1 = jfje1.toFixed(2);
      dfje1 = dfje1.toFixed(2);
      const xsjz = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, rq: rq, zdr: zdr, km_code_jf1: km_code_jf1, km_code_df1: km_code_df1, jfje1: jfje1, dfje1: dfje1, zy: zy, bz: bz };
      pz.push(xsjz);
    }
    //凭证根据日期进行排序
    pz = pz.sort((a, b) => new Date(a.rq) - new Date(b.rq));
    //凭证生成
    for (var prod of pz) {
      let zth = prod.zth;
      let nkjqj = prod.nkjqj;
      let ykjqj = prod.ykjqj;
      let rq = prod.rq;
      let zdr = prod.zdr;
      let km_code_jf1 = prod.km_code_jf1;
      let km_code_jf2 = prod.km_code_jf2;
      let km_code_df1 = prod.km_code_df1;
      let km_code_df2 = prod.km_code_df2;
      let jfje1 = prod.jfje1;
      let jfje2 = prod.jfje2;
      let dfje1 = prod.dfje1;
      let dfje2 = prod.dfje2;
      let zy = prod.zy;
      let bz = prod.bz;
      const pzhadd = {
        pzh: "0000"
      };
      var pzhcx = ObjectStore.queryByYonQL("select max(pzh) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_ZB_001 where zth='" + zth + "' and nkjqj='" + nkjqj + "' and ykjqj='" + ykjqj + "'");
      if (pzhcx.length == 0) {
        pzhcx.push(pzhadd);
      }
      let pzh1 = pzhcx[0]["pzh"];
      let newpzh = parseInt(pzh1) + 1;
      newpzh = ("000" + newpzh).slice(-4);
      let pzzb = [];
      let pzmxb = [];
      let pzview = [];
      if (zy.indexOf("采购商品") >= 0) {
        const obj_zb = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, rq: rq, fdjs: 1, zdr: zdr, zdrq: rq, shr: null, shrq: null, shbj: "否", jzr: null, jzrq: null, jzbj: "否", bz: bz };
        const obj_mxb_1 = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, km_code: km_code_jf1, zy: zy, jfje: jfje1, dfje: 0 };
        const obj_mxb_2 = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, km_code: km_code_jf2, zy: zy, jfje: jfje2, dfje: 0 };
        const obj_mxb_3 = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, km_code: km_code_df1, zy: zy, jfje: 0, dfje: dfje1 };
        const obj_view_pz1 = {
          zth: zth,
          nkjqj: nkjqj,
          ykjqj: ykjqj,
          pzh: newpzh,
          rq: rq,
          fdjs: 1,
          zdr: zdr,
          zdrq: rq,
          shr: null,
          shrq: null,
          shbj: "否",
          jzr: null,
          jzrq: null,
          jzbj: "否",
          bz: bz,
          km_code: km_code_jf1,
          zy: zy,
          jfje: jfje1,
          dfje: 0
        };
        const obj_view_pz2 = {
          zth: zth,
          nkjqj: nkjqj,
          ykjqj: ykjqj,
          pzh: newpzh,
          rq: rq,
          fdjs: 1,
          zdr: zdr,
          zdrq: rq,
          shr: null,
          shrq: null,
          shbj: "否",
          jzr: null,
          jzrq: null,
          jzbj: "否",
          bz: bz,
          km_code: km_code_jf2,
          zy: zy,
          jfje: jfje2,
          dfje: 0
        };
        const obj_view_pz3 = {
          zth: zth,
          nkjqj: nkjqj,
          ykjqj: ykjqj,
          pzh: newpzh,
          rq: rq,
          fdjs: 1,
          zdr: zdr,
          zdrq: rq,
          shr: null,
          shrq: null,
          shbj: "否",
          jzr: null,
          jzrq: null,
          jzbj: "否",
          bz: bz,
          km_code: km_code_df1,
          zy: zy,
          jfje: 0,
          dfje: dfje1
        };
        pzzb.push(obj_zb);
        pzmxb.push(obj_mxb_1, obj_mxb_2, obj_mxb_3);
        pzview.push(obj_view_pz1, obj_view_pz2, obj_view_pz3);
      }
      if (zy.indexOf("销售商品") >= 0) {
        const obj_zb = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, rq: rq, fdjs: 1, zdr: zdr, zdrq: rq, shr: null, shrq: null, shbj: "否", jzr: null, jzrq: null, jzbj: "否", bz: bz };
        const obj_mxb_1 = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, km_code: km_code_jf1, zy: zy, jfje: jfje1, dfje: 0 };
        const obj_mxb_2 = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, km_code: km_code_df1, zy: zy, jfje: 0, dfje: dfje1 };
        const obj_mxb_3 = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, km_code: km_code_df2, zy: zy, jfje: 0, dfje: dfje2 };
        const obj_view_pz1 = {
          zth: zth,
          nkjqj: nkjqj,
          ykjqj: ykjqj,
          pzh: newpzh,
          rq: rq,
          fdjs: 1,
          zdr: zdr,
          zdrq: rq,
          shr: null,
          shrq: null,
          shbj: "否",
          jzr: null,
          jzrq: null,
          jzbj: "否",
          bz: bz,
          km_code: km_code_jf1,
          zy: zy,
          jfje: jfje1,
          dfje: 0
        };
        const obj_view_pz2 = {
          zth: zth,
          nkjqj: nkjqj,
          ykjqj: ykjqj,
          pzh: newpzh,
          rq: rq,
          fdjs: 1,
          zdr: zdr,
          zdrq: rq,
          shr: null,
          shrq: null,
          shbj: "否",
          jzr: null,
          jzrq: null,
          jzbj: "否",
          bz: bz,
          km_code: km_code_df1,
          zy: zy,
          jfje: 0,
          dfje: dfje1
        };
        const obj_view_pz3 = {
          zth: zth,
          nkjqj: nkjqj,
          ykjqj: ykjqj,
          pzh: newpzh,
          rq: rq,
          fdjs: 1,
          zdr: zdr,
          zdrq: rq,
          shr: null,
          shrq: null,
          shbj: "否",
          jzr: null,
          jzrq: null,
          jzbj: "否",
          bz: bz,
          km_code: km_code_df2,
          zy: zy,
          jfje: 0,
          dfje: dfje2
        };
        pzzb.push(obj_zb);
        pzmxb.push(obj_mxb_1, obj_mxb_2, obj_mxb_3);
        pzview.push(obj_view_pz1, obj_view_pz2, obj_view_pz3);
      }
      if (zy.indexOf("销售成本") >= 0) {
        const obj_zb = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, rq: rq, fdjs: 1, zdr: zdr, zdrq: rq, shr: null, shrq: null, shbj: "否", jzr: null, jzrq: null, jzbj: "否", bz: bz };
        const obj_mxb_1 = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, km_code: km_code_jf1, zy: zy, jfje: jfje1, dfje: 0 };
        const obj_mxb_2 = { zth: zth, nkjqj: nkjqj, ykjqj: ykjqj, pzh: newpzh, km_code: km_code_df1, zy: zy, jfje: 0, dfje: dfje1 };
        const obj_view_pz1 = {
          zth: zth,
          nkjqj: nkjqj,
          ykjqj: ykjqj,
          pzh: newpzh,
          rq: rq,
          fdjs: 1,
          zdr: zdr,
          zdrq: rq,
          shr: null,
          shrq: null,
          shbj: "否",
          jzr: null,
          jzrq: null,
          jzbj: "否",
          bz: bz,
          km_code: km_code_jf1,
          zy: zy,
          jfje: jfje1,
          dfje: 0
        };
        const obj_view_pz2 = {
          zth: zth,
          nkjqj: nkjqj,
          ykjqj: ykjqj,
          pzh: newpzh,
          rq: rq,
          fdjs: 1,
          zdr: zdr,
          zdrq: rq,
          shr: null,
          shrq: null,
          shbj: "否",
          jzr: null,
          jzrq: null,
          jzbj: "否",
          bz: bz,
          km_code: km_code_df1,
          zy: zy,
          jfje: 0,
          dfje: dfje1
        };
        pzzb.push(obj_zb);
        pzmxb.push(obj_mxb_1, obj_mxb_2);
        pzview.push(obj_view_pz1, obj_view_pz2);
      }
      let pz_zb = ObjectStore.insertBatch("AT1808958A17680009.AT1808958A17680009.ZW_PZ_ZB_001", pzzb, "ZW_PZ_ZB_001List");
      let pz_mxb = ObjectStore.insertBatch("AT1808958A17680009.AT1808958A17680009.ZW_PZ_MXB_001", pzmxb, "ZW_PZ_MXB_001List");
      let pz_view = ObjectStore.insertBatch("AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001", pzview, "ZW_PZ_VIEW_001List");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });