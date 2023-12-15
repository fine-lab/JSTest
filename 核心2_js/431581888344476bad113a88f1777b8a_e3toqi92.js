let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //主表全部数据
    let hexiaodan = request.hexiaodan;
    //修改主表数据
    //收款单id
    let xhylshoukuandanid = hexiaodan.xhylshoukuandan;
    let shoukuandanUpdate = { id: xhylshoukuandanid, xhylhexiaozhuangtai: "已核销" };
    let shoukuandanUpdateres = ObjectStore.updateById("AT19D3CA6A0868000B.AT19D3CA6A0868000B.xhyl_shoukuandan", shoukuandanUpdate, "xhyl_shoukuandan");
    //修改行数据
    let fzarr = [];
    for (var i = 0; i < request.updateline.length; i++) {
      //获取发票单id
      let xhyl_fapiaoid = request.updateline[i].xhyl_fapiao;
      //存发票id,后期更新主表用
      fzarr.push(xhyl_fapiaoid);
      //获取发货单id
      let xhyl_fahuoid = request.updateline[i].new21;
      //修改发票单行的核销状态
      var object = { id: xhyl_fapiaoid, xhyl_fahuodanList: [{ hasDefaultInit: true, id: xhyl_fahuoid, new14: "已核销", _status: "Update" }] };
      var res = ObjectStore.updateById("AT19D3CA6A0868000B.AT19D3CA6A0868000B.xhyl_fapiao", object, "xhyl_fapiao");
    }
    //测试区
    //将发票单去重
    const uniqueArr = Array.from(new Set(fzarr));
    for (var i = 0; i < uniqueArr.length; i++) {
      //表的发票单id
      let xhyl_fapiaoid = uniqueArr[i];
      //一张发票下的所有发货单
      let allFahuo = { xhyl_fapiao_id: xhyl_fapiaoid };
      let allFahuores = ObjectStore.selectByMap("AT19D3CA6A0868000B.AT19D3CA6A0868000B.xhyl_fahuodan", allFahuo);
      //一张发票下的已核销的发票单
      let someFahuo = { xhyl_fapiao_id: xhyl_fapiaoid, new14: "已核销" };
      let someFahuores = ObjectStore.selectByMap("AT19D3CA6A0868000B.AT19D3CA6A0868000B.xhyl_fahuodan", someFahuo);
      //判断是否相等,决定要不要修改发票头为已核销
      if (allFahuores.length === someFahuores.length) {
        let object = { id: xhyl_fapiaoid, new7: "已核销" };
        let objectres = ObjectStore.updateById("AT19D3CA6A0868000B.AT19D3CA6A0868000B.xhyl_fapiao", object, "xhyl_fapiao");
      }
    }
    //一张发票下的所有发货单
    //批量修改
    //循环从后台脚本获取到的编码
    let successful = "成功";
    return { successful };
  }
}
exports({ entryPoint: MyAPIHandler });