/* 공통 제어: jQuery Mobile이 로드되면 Mobile API 사용, 오프라인에는 화면 전환 대체 */
(function () {
  'use strict';
  function stopMedia() {
    document.querySelectorAll('video, audio').forEach(function(m){
      if (!m.paused) m.pause();
    });
  }
  function initFallback(){
    if (window.jQuery && jQuery.mobile) return;
    document.body.classList.add('fallback');
    var pages=[].slice.call(document.querySelectorAll('[data-role="page"]'));
    function navigate(hash){
      var selected=hash && document.querySelector(hash);
      if(!selected || !selected.matches('[data-role="page"]')) selected=document.getElementById('home');
      stopMedia();
      pages.forEach(function(p){p.classList.toggle('active',p===selected);});
      window.scrollTo(0,0);
    }
    document.querySelectorAll('[data-role="collapsible"]').forEach(function(c){
      var h=c.querySelector('h3'), body=c.querySelector('.collapsible-body');
      if(!h || !body) return;
      body.hidden=c.getAttribute('data-collapsed')!=='false';
      h.addEventListener('click',function(){body.hidden=!body.hidden;});
    });
    document.body.addEventListener('click',function(e){
      var a=e.target.closest('a[href^="#"]');
      if(!a) return;
      if(a.classList.contains('photo-link')) return;
      if(a.getAttribute('data-rel')==='popup')return;
      var target=document.querySelector(a.getAttribute('href'));
      if(target && target.matches('[data-role="page"]')){
        e.preventDefault();history.replaceState(null,'',a.getAttribute('href'));
        navigate(a.getAttribute('href'));
      }
    });
    window.addEventListener('hashchange',function(){navigate(location.hash)});
    navigate(location.hash);
  }
  function bindGallery(){
    function openImage(e){
      var popup=document.getElementById('galleryPopup');
      if(!popup) return;
      var a=this;
      document.getElementById('largePhoto').src=a.getAttribute('data-src');
      document.getElementById('largePhoto').alt=a.getAttribute('data-title');
      document.getElementById('largeTitle').textContent=a.getAttribute('data-title');
      if (!(window.jQuery && jQuery.mobile)) { e.preventDefault();popup.classList.add('fallback-open'); }
    }
    // jQuery 이벤트 위임: 나중에 추가된 갤러리 링크도 처리할 수 있습니다.
    if(window.jQuery) jQuery(document).on('click', '.photo-link', openImage);
    else document.addEventListener('click',function(e){
      var link=e.target.closest('.photo-link');if(link)openImage.call(link,e);
    });
    var close=document.getElementById('closePopup');
    if(close)close.addEventListener('click',function(){
      var pop=document.getElementById('galleryPopup');
      if(window.jQuery && jQuery.mobile && jQuery(pop).popup) jQuery(pop).popup('close');
      else pop.classList.remove('fallback-open');
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape')document.getElementById('galleryPopup')?.classList.remove('fallback-open');
    });
  }
  function init(){
    initFallback();bindGallery();
    if(window.jQuery){
      jQuery(document).on('pagehide', '[data-role="page"]', stopMedia);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(){if(!a.classList.contains('photo-link'))stopMedia()});
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
