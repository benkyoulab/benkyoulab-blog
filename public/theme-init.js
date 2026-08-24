// Terapkan tema sebelum paint — mencegah flash putih saat reload dalam mode gelap.
(function () {
  try {
    var t = localStorage.getItem("theme");
    var dark = t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
