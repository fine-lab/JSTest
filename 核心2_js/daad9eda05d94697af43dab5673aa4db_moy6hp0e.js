let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    var object = [];
    for (var i = 0; i < datas.length; i++) {
      var ids = datas[i].id;
      var values = datas[i].value;
      var dates = values.date;
      var qckc = values.start_count; //期初库存
      var hjbh = values.receipts_count; //货件补货
      var mjth = values.customer_returns_count; //买家退货
      var ddfh = values.shipments_count; //订单发货
      var kcyc = values.vendor_returns_count; //库存移除
      var ycs = values.damaged_total_amount; //已残损
      var yzd = values.found_count; //已找到
      var ds = values.lost_total_amount; //丢失
      var qz = values.disposed_count; //弃置
      var qt = values.other_events_count; //其他
      var kfzy = values.whse_transfers_count; //库房转运
      var kccy = values.difference_count; //库存差异
      var kczzl = values.inventory_turnover_rate; //库存周转率
      var kczzts = values.inventory_turnover_days; //库存周转天数
      var cxb = values.stock_to_use_rate; //存销比
      var qmkc = values.end_count; //期末库存
      var qmzt = values.end_on_way_count; //期末在途
      var yczt = values.transferring_out_count; //移仓在途
      var qmh = values.ending_inventory; //期末库存(含移仓)
      var qch = values.opening_inventory; //期初库存(含移仓)
      var sku = values.sku; //品名
      var cangku = values.warehousename; //仓库
      var body = {
        productId: ids, //物料
        dates: dates + "-01", //日期
        allAmount: qckc, //期初库存
        huojianbuhuo: hjbh, //货件补货
        maijiatuihuo: mjth, //买家退货
        dingdanfahuo: ddfh, //订单发货
        kucunyichu: kcyc, //库存移除
        yicansun: ycs, //已残损
        yizhaodao: yzd, //已找到
        dingshi: ds, //丢失
        qizhi: qz, //弃置
        qita: qt, //其他
        kufangzhuanyun: kfzy, //库房转运
        kucunchayi: kccy, //库存差异
        kucunzhouzhuanlv: kczzl + "%", //库存周转率
        kucunzhouzhuantianshu: kczzts, //库存周转天数
        cunxiaobi: cxb, //存销比
        shijizaitu: qmkc, //期末库存
        qimozaitu: qmzt, //期末在途
        yicangzaitu: yczt, //移仓在途
        qimokucunhanyicang: qmh, //期末库存(含移仓)
        qichukucunhanyicang: qch, //期初库存(含移仓)
        sapNumb: sku, //品名
        cangku: cangku //仓库
      };
      object.push(body);
    }
    var res = ObjectStore.insertBatch("AT15F20D2209680003.AT15F20D2209680003.productEntity", object, "yb4f566ea2");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });