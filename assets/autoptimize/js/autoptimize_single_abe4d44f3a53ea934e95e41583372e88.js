(function($){'use strict';jQuery('.ratecard-menu ul li a[href*=#]').bind('click',function(e){e.preventDefault();var target=jQuery(this).attr("href");jQuery('html, body').stop().animate({scrollTop:jQuery(target).offset().top},600,function(){location.hash=target;});return false;});jQuery(window).scroll(function(){var scrollDistance=jQuery(window).scrollTop();jQuery('.page-section').each(function(i){if(jQuery(this).position().top<=scrollDistance+5){jQuery('.ratecard-menu li.active').removeClass('active');jQuery('.ratecard-menu li').eq(i).addClass('active');}});}).scroll();if(jQuery('.darkSec').length){var body=jQuery('body'),darkSection=jQuery('.darkSec'),offset=darkSection.offset().top-10;jQuery(window).scroll(function(){var scroll=jQuery(window).scrollTop();if(scroll>=offset){body.addClass('dark');}else{body.removeClass('dark');}
if(scroll>=(offset+darkSection.outerHeight())){body.removeClass('dark');}});}
if($(window).width()<992){jQuery('.all-links').click(function(){jQuery('#all-menu').slideToggle(300);jQuery(this).toggleClass('open');});jQuery('#all-menu a').click(function(e){jQuery('.all-links').text(jQuery(this).text());jQuery('#all-menu').slideUp();jQuery(this).addClass('current');jQuery('.all-links').removeClass('open');jQuery('.case-studies-page .filterOptions li a').removeClass('current');e.preventDefault();})
jQuery(window).load(stickyMenu);jQuery(window).resize(stickyMenu);jQuery(window).scroll(stickyMenu);var prevScroll=0,currentSCroll=1,targetScroll_=200;function stickyMenu(){currentSCroll=jQuery(window).scrollTop()
if(currentSCroll<prevScroll){if(jQuery(window).scrollTop()>targetScroll_){jQuery('.ratecard-menu').addClass('fix');}else{jQuery('.ratecard-menu').removeClass('fix');jQuery('.ratecard-menu').removeClass('fix-ready');jQuery('.ratecard-menu').removeClass('fix-allot-pos');}}else{if(jQuery('.ratecard-menu').hasClass('fix-allot-pos')){jQuery('.ratecard-menu').addClass('fix-ready').delay(15000,function(){});}
jQuery('.ratecard-menu').removeClass('fix');if(jQuery(window).scrollTop()<10){jQuery('.ratecard-menu').removeClass('fix-ready');}else{jQuery('.ratecard-menu').addClass('fix-allot-pos');}}
prevScroll=currentSCroll;}}})(jQuery);