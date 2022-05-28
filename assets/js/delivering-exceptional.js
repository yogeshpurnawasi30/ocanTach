(function( $ ) { 
	'use strict';

/*************Common services banner logo START**********/
jQuery('.slideblk .logos-slider .slides').slick({
    lazyLoad: 'ondemand',
    slidesToShow:7,
    slidesToScroll:1,
    dots: false,
    infinite:true,
    arrows:false,
    centerMode: false,
    autoplay:true,
    autoplaySpeed:3000,
    responsive:[
    {
            breakpoint:1200,
            settings:{
                slidesToShow:5
            }
        },
        {
            breakpoint:991,
            settings:{
                slidesToShow:4
            }
        },
        {
            breakpoint:767,
            settings:{
                slidesToShow:3
            }
        },
        {
            breakpoint:480,
            settings:{
                slidesToShow:2
            }
        }
    ]
})
/*************Common services banner logo END**********/



})(jQuery);