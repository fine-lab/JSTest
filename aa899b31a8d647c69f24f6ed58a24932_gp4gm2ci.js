let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var resObj = {};
    var object = {
      dr: 0,
      compositions: [
        {
          name: "kk_xiangm_ziyuanList",
          compositions: [
            {
              name: "kk_xiangm_ziyuan_kekaiguwenList",
              compositions: []
            }
          ]
        }
      ]
    };
    var res = ObjectStore.selectByMap("AT17B9FBFC09580006.AT17B9FBFC09580006.kk_xiangmu_gl", object, "yb75b4d97c");
    resObj.searchRes = res;
    if (res.length > 0) {
      let list = [];
      res.forEach((xmItem) => {
        if (xmItem.kk_xiangm_ziyuanList && xmItem.kk_xiangm_ziyuanList.length > 0) {
          xmItem.kk_xiangm_ziyuanList.forEach((ziyuanItem) => {
            if (ziyuanItem.kk_xiangm_ziyuan_kekaiguwenList && ziyuanItem.kk_xiangm_ziyuan_kekaiguwenList.length > 0) {
              ziyuanItem.kk_xiangm_ziyuan_kekaiguwenList.forEach((guwen) => {
                if (guwen.kekaiguwen && guwen.kekaiguwen.length > 4) {
                  list.push({
                    id: guwen.kekaiguwen,
                    kk_kekaiguwen_xiangmuList: [
                      {
                        dangqianXiangmu: xmItem.id,
                        xiangmuSuoshuHangye: xmItem.suoshuHangye,
                        _status: "Insert" // 子表行内的_status必填
                      }
                    ]
                  });
                }
              });
            }
          });
        }
      });
      var updateRes = ObjectStore.updateBatch("AT17B9FBFC09580006.AT17B9FBFC09580006.kk_kekai_guwen", list, "ybc2a3b322");
      resObj.updateRes = updateRes;
    }
    return resObj;
  }
}
exports({ entryPoint: MyTrigger });