setTimeout(function(){
$('.preloader-position').fadeToggle();

},0.800);


$(document).ready(function()
{
$(".phone").inputmask("(+99)-999-999-9999");
});


$(function() {
    $(".email").inputmask("email");
  });

(function () {
    // Vertical Timeline - by CodyHouse.co
    function VerticalTimeline(element) {
        this.element = element;
        this.blocks = this.element.getElementsByClassName("js-cd-block");
        this.images = this.element.getElementsByClassName("js-cd-img");
        this.contents = this.element.getElementsByClassName("js-cd-content");
        this.offset = 0.8;
        this.hideBlocks();
    };

    VerticalTimeline.prototype.hideBlocks = function () {
        //hide timeline blocks which are outside the viewport
        if (!"classList" in document.documentElement) {
            return;
        }
        var self = this;
        for (var i = 0; i < this.blocks.length; i++) {
            (function (i) {
                if (self.blocks[i].getBoundingClientRect().top > window.innerHeight * self.offset) {
                    self.images[i].classList.add("cd-is-hidden");
                    self.contents[i].classList.add("cd-is-hidden");
                }
            })(i);
        }
    };

    VerticalTimeline.prototype.showBlocks = function () {
        if (! "classList" in document.documentElement) {
            return;
        }
        var self = this;
        for (var i = 0; i < this.blocks.length; i++) {
            (function (i) {
                if (self.contents[i].classList.contains("cd-is-hidden") && self.blocks[i].getBoundingClientRect().top <= window.innerHeight * self.offset) {
                    // add bounce-in animation
                    self.images[i].classList.add("cd-timeline__img--bounce-in");
                    self.contents[i].classList.add("cd-timeline__content--bounce-in");
                    self.images[i].classList.remove("cd-is-hidden");
                    self.contents[i].classList.remove("cd-is-hidden");
                }
            })(i);
        }
    };

    var verticalTimelines = document.getElementsByClassName("js-cd-timeline"),
        verticalTimelinesArray = [],
        scrolling = false;
    if (verticalTimelines.length > 0) {
        for (var i = 0; i < verticalTimelines.length; i++) {
            (function (i) {
                verticalTimelinesArray.push(new VerticalTimeline(verticalTimelines[i]));
            })(i);
        }

        //show timeline blocks on scrolling
        window.addEventListener("scroll", function (event) {
            if (!scrolling) {
                scrolling = true;
                (!window.requestAnimationFrame) ? setTimeout(checkTimelineScroll, 250) : window.requestAnimationFrame(checkTimelineScroll);
            }
        });
    }

    function checkTimelineScroll() {
        verticalTimelinesArray.forEach(function (timeline) {
            timeline.showBlocks();
        });
        scrolling = false;
    };
})();


$(document).ready(function () {

    $("#slider").owlCarousel({ items: 1, nav: !0, dots: !1, navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'] })

    $("#lifeCarousel").owlCarousel({

        loop: true,

        autoplay: true,

        items: 9,

        nav: !1,

        dots: !1,

        autoplayHoverPause: true,

        animateOut: 'slideOutUp',

        animateIn: 'slideInUp'

    })

    $("#socialCarousel").owlCarousel({ items: 1, nav: !0, dots: !1, autoplay: true, autoplayTimeout: 3000, loop: !0, autoplayHoverPause: true, navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'] })

    //$("#tabs").slick({ slidesToShow: 3, vertical: true, verticalSwiping: true, slidesToScroll: 1 })

    $("#tabs").slick({

        dots: false,

        vertical: true,

        //verticalSwiping: true,

        slidesToShow: 12,

        slidesToScroll: 1,

        infinite: false

    });



    $("#companyCarousel").slick({

        dots: !1, arrows: !1, vertical: !0, slidesToShow: 3, slidesToScroll: 1, infinite: !0, autoplay: !0, autoplaySpeed: 2000

    })



    $(".parallax-window").parallax();



    $("#tabs .div").click(function () {

        var t = $(this);

        var i = parseFloat(t.index(), 10) + 1;

        $(".tab").hide();

        $("#tab" + i).show();

        $("#tabs .div").removeClass("active");

        t.addClass("active");

        //$('.counter').each(function () {

        //    $(this).prop('Counter', 0).animate({

        //        Counter: $(this).text()

        //    }, {

        //        duration: 2500,

        //        easing: 'swing',

        //        step: function (now) {

        //            $(this).text(Math.ceil(now));

        //        }

        //    });

        //});

    });



    $("#tabs .div:first").click();



    $("#mediaCarousel").owlCarousel({ items: 1, nav: !0, dots: !1, navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'] })



})
