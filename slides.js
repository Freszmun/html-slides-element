(function() {
    let template = `<span class="line up"></span>
<span class="line left"></span>
<div class="container">
    <!--content-->
</div>
<span class="line right"></span>
<span class="line bottom"></span>`;
    class HTMLGalleryElement extends HTMLElement {
        slide = 1;
        animating = false;
        borderLineLength = '35%';
        gallerySlide4_Step1(gal, lineRight, lineLeft, lineUp, lineBottom, lineLength, num, next) {
            lineUp.style.transition = lineBottom.style.transition = 'all .4s ease-in-out';
            lineRight.style.bottom = '0%';
            lineLeft.style.top = '-' + lineLength;
            gal.animating = false;
            if (next) next(gal, num);
        }
        gallerySlide1_Step2(gal, lineRight, lineLeft, lineUp, lineBottom, lineLength, num, next) {
            lineUp.style.transform = 'rotate(180deg)';
            lineUp.style.left = '0%';
            lineLeft.style.top = '0%';
            lineUp.style.width = lineBottom.style.width = '0%';
            lineLeft.style.height = lineRight.style.height = lineLength;
            lineLeft.style.transform = lineRight.style.transform = 'rotate(180deg)';
            lineRight.style.bottom = lineLength;
            lineBottom.style.right = '-100%';
            setTimeout(() => {
                lineUp.style.left = '100%';
                lineBottom.style.right = '100%';
                setTimeout(() => {
                    gal.animating = false;
                    if (next) next(gal, num);
                }, 400);
            }, 400);
        }
        gallerySlideUpdate(gal, num, next) {
            gal.animating = true;
            let lineLength = this.borderLineLength,
                lineUp = this.lineUp || gal.querySelector('.line.up'),
                lineLeft = this.lineLeft || gal.querySelector('.line.left'),
                lineRight = this.lineRight || gal.querySelector('.line.right'),
                lineBottom = this.lineBottom || gal.querySelector('.line.bottom'),
                slides = this.querySelectorAll('.container .slide');
            this.lineUp = lineUp;
            this.lineLeft = lineLeft;
            this.lineRight = lineRight;
            this.lineBottom = lineBottom;
            this.style.setProperty('--slide', num);
            for (let i = 0; i < slides.length; i++) {
                if (i + 1 === num) {
                    slides[i].classList.add('display');
                } else {
                    if (slides[i].classList.contains('display')) slides[i].classList.remove('display');
                }
            }
            if (num === 1) {
                lineUp.style.transform = 'rotate(180deg)';
                lineUp.style.left = `calc((${lineLength} / 3) * -1)`;
                lineLeft.style.top = '0%';
                lineLeft.style.height = lineRight.style.height = lineLength;
                lineLeft.style.transform = lineRight.style.transform = 'rotate(0deg)';
                lineUp.style.width = lineBottom.style.width = `calc(${lineLength} / 3)`;
                lineRight.style.bottom = lineLength;
                lineBottom.style.right = '-100%';
                setTimeout(this.gallerySlide1_Step2, 460, gal, lineRight, lineLeft, lineUp, lineBottom, lineLength, num, next);
            } else if (num === 2) {
                lineUp.style.transform = 'rotate(180deg)';
                lineUp.style.left = '100%';
                lineLeft.style.top = `calc(100% - ${lineLength})`;
                lineLeft.style.height = lineRight.style.height = lineLength;
                lineLeft.style.transform = lineRight.style.transform = 'rotate(0deg)';
                lineUp.style.width = lineBottom.style.width = `calc(${lineLength} / 3)`;
                lineRight.style.bottom = '100%';
                lineBottom.style.right = '100%';
                gal.animating = false;
                if (next) next(gal, num);
            } else if (num === 3) {
                lineUp.style.transition = lineBottom.style.transition = 'all .4s ease-in-out, right .2s ease-in-out, width .3s ease-in-out';
                lineUp.style.transform = 'rotate(180deg)';
                lineUp.style.left = `calc(100% - ${lineLength})`;
                lineLeft.style.top = '100%';
                lineLeft.style.height = lineRight.style.height = '0%';
                lineLeft.style.transform = lineRight.style.transform = 'rotate(180deg)';
                lineUp.style.width = lineBottom.style.width = lineLength;
                lineRight.style.bottom = '100%';
                lineBottom.style.right = '0%';
                setTimeout(this.gallerySlide4_Step1, 450, gal, lineRight, lineLeft, lineUp, lineBottom, lineLength, num, next);
            }
        }
        galleryClick(next) {
            if (this.animating) return;
            if (!this.slide || this.slide === 3) this.slide = 0;
            this.slide++;
            this.gallerySlideUpdate(this, this.slide, next);
        }
        setLineLength(lineLength) {
            this.borderLineLength = lineLength;
        }
        setSlide(targetSlide = 1, stepByStep = false) {
            targetSlide = Math.round(targetSlide);
            if (targetSlide < 1) targetSlide = 1;
            if (targetSlide > 3) targetSlide = 3;
            if (stepByStep) {
                this.galleryClick((gal, num) => {
                    if (num !== targetSlide) this.setSlide(targetSlide, true);
                });
            } else {
                this.gallerySlideUpdate(this, targetSlide);
            }
        }
        connectedCallback() {
            setTimeout(() => {
                let before = this.innerHTML + '';
                this.innerHTML = template.replace('<!--content-->', before);
                this.gallerySlideUpdate(this, 1);
            });
        }
    }
    window.customElements.define('app-slides', HTMLGalleryElement);
    let style = `app-slides, app-slides .container, app-slides .line, app-slides .container .slide{position:relative}
app-slides{--slide:1;overflow:hidden;display:block}
app-slides .container{padding:0;margin:0;width:calc(100% - 4px);height:calc(100% - 4px);left:2px;box-sizing:border-box;overflow:hidden}
app-slides .line{display:inline-block;background-color:rgba(255,255,255,var(--line-alpha,.5))}
app-slides .line.left, app-slides .line.right{height:0;width:2px;bottom:0}
app-slides .line.left{float:left}
app-slides .line.right{float:right;bottom:30%}
app-slides .line.up, app-slides .line.bottom{width:0;height:2px;clear:both}
app-slides .line.bottom{right:0;bottom:0}
app-slides .line{transition:all .4s ease-in-out,transform 0s ease-in-out}
app-slides .container .slide{top:0;padding:1cm;width: calc(100% - 2cm);height:calc(100% - 2cm);opacity:0;transition:all .4s ease-in-out}
app-slides .container .slide.display{opacity:1}
app-slides .container .slide:nth-child(1){left:calc((var(--slide) - 1) * -100%)}
app-slides .container .slide:nth-child(2){top:-100%;left:calc(100% + (var(--slide) - 1) * -100%)}
app-slides .container .slide:nth-child(3){top:-200%;left:calc(200% + (var(--slide) - 1) * -100%)}`;
    let styleElement = document.createElement('style');
    styleElement.setAttribute('name', 'slides-element-style');
    styleElement.innerHTML = style;
    if (window.body) {
        // this activates when you place script on body end
        window.body.appendChild(styleElement);
    } else {
        // this activates when you place script in head
        window.addEventListener('DOMContentLoaded', ev => {
            ev.target.body.appendChild(styleElement);
        });
    }
})();
