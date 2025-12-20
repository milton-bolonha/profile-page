import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class Cylinder {
  title: HTMLElement;
  textWrapper: HTMLElement;
  textItems: NodeListOf<HTMLElement>;
  wrapper: HTMLElement;

  constructor() {
    this.title = document.querySelector('.cylinder__title') as HTMLElement;
    this.textWrapper = document.querySelector('.cylinder__text__wrapper') as HTMLElement;
    this.textItems = document.querySelectorAll('.cylinder__text__item') as NodeListOf<HTMLElement>;
    this.wrapper = document.querySelector('.cylinder__wrapper') as HTMLElement;
    this.init();
  }

  init(): void {
    if (!this.title || !this.textWrapper) return;
    this.calculatePositions();
    this.createScrollTrigger();
  }

  calculatePositions(): void {
    const offset = 0.4;
    const radius = Math.min(window.innerWidth, window.innerHeight) * offset;
    const spacing = 180 / this.textItems.length;

    this.textItems.forEach((item, index) => {
      const angle = (index * spacing * Math.PI) / 180;
      const rotationAngle = index * -spacing;

      const x = 0;
      const y = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      item.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotationAngle}deg)`;
    });
  }

  createScrollTrigger(): void {
    ScrollTrigger.create({
      trigger: this.title,
      start: 'center center',
      end: '+=2000svh',
      pin: this.wrapper,
      scrub: 2,
      animation: gsap.fromTo(this.textWrapper, { rotateX: -80 }, { rotateX: 270, ease: 'none' }),
    });
  }

  resize(): void {
    this.calculatePositions();
  }
}
