// Weekly Trends 목록 페이지네이션 — 각 컬럼(수동/자동)을 독립적으로 처리한다.
// 항목이 data-page-size(기본 10)를 넘으면 하단에 페이지 번호 버튼을 렌더한다.
(function () {
  var DEFAULT_PAGE_SIZE = 10;

  function paginate(list) {
    var col = list.closest('.wt-col') || list.parentElement;
    var pager = col ? col.querySelector('.wt-pager') : null;
    var items = Array.prototype.filter.call(list.children, function (el) {
      return el.classList.contains('wt-item');
    });
    var size = parseInt(list.getAttribute('data-page-size'), 10) || DEFAULT_PAGE_SIZE;
    var pageCount = Math.ceil(items.length / size);

    if (!pager) return;
    if (pageCount <= 1) {
      pager.hidden = true;
      return;
    }

    function show(page) {
      items.forEach(function (el, i) {
        el.hidden = Math.floor(i / size) !== page;
      });
      Array.prototype.forEach.call(pager.children, function (btn, i) {
        if (i === page) {
          btn.setAttribute('aria-current', 'true');
        } else {
          btn.removeAttribute('aria-current');
        }
      });
    }

    pager.innerHTML = '';
    for (var i = 0; i < pageCount; i++) {
      (function (idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = String(idx + 1);
        btn.addEventListener('click', function () { show(idx); });
        pager.appendChild(btn);
      })(i);
    }
    pager.hidden = false;
    show(0);
  }

  function init() {
    var lists = document.querySelectorAll('.wt-list[data-paginate]');
    Array.prototype.forEach.call(lists, paginate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
