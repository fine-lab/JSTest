mtl.openLocation({
  latitude: 40.068928,
  longitude: 116.236847,
  name: "用友软件园",
  address: "北清路68号",
  scale: 28,
  fail: function (err) {
    var message = err.message; // 错误信息
  }
});
mtl.chooseImage({
  count: 1,
  sourceType: ["album", "camera"],
  success: function (res) {
    // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    var localIds = res.localIds; // ['wxLocalResource://imageid123456789', ...]
  },
  fail: function (err) {
    var message = err.message; // 错误信息
  }
});
mtl.getLocation({
  type: "wgs84",
  success: function (res) {
    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180
  },
  fail: function (err) {
    var message = err.message; // 错误信息
  }
});