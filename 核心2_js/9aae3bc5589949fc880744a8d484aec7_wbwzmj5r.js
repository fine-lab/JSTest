cb.defineInner([], function () {
  var MyExternal = {
    getDistance: function (params) {
      var radLng1 = radians(params.lng1);
      var radLat1 = radians(params.lat1);
      var radLng2 = radians(params.lng2);
      var radLat2 = radians(params.lat2);
      var a = radLat2 - radLat1;
      var b = radLng2 - radLng1;
      // 通过公式计算两点之间的距离（单位Km）
      var disKm = 2 * Math.asin(Math.sqrt(Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(radLat2) * Math.cos(radLat1) * Math.sin(b / 2) * Math.sin(b / 2))) * 6378.137;
      // 将距离转化为米(m)并保留两位小数
      var dis = (disKm * 1000).toFixed(2);
      return dis;
    }
  };
  return MyExternal;
});
function radians(d) {
  var PI = Math.PI;
  return (d * PI) / 180.0;
}