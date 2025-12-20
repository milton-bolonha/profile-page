import { ScrollTrigger } from "gsap/ScrollTrigger";

export class Tube {
  private items: NodeListOf<HTMLElement>;
  private textWrapper: HTMLElement;
  private wrapper: HTMLElement;

  constructor() {
    this.wrapper = document.querySelector(".tube__wrapper") as HTMLElement;
    this.textWrapper = document.querySelector(
      ".tube__text__wrapper"
    ) as HTMLElement;
    this.items = document.querySelectorAll(".tube__text__item");

    this.init();
  }

  private init(): void {
    if (!this.wrapper) return;
    this.calculatePositions();
    this.createScrollTrigger();
  }

  private calculatePositions(): void {
    const offset = 0.4;
    const radius = Math.min(window.innerWidth, window.innerHeight) * offset;
    const spacing = 360 / this.items.length;

    this.items.forEach((item, index) => {
      const angle = (index * spacing * Math.PI) / 180;

      const x = Math.sin(angle) * radius;
      const y = 0;
      const z = Math.cos(angle) * radius;
      const rotationY = index * spacing;

      item.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotationY}deg)`;
    });
  }

  createScrollTrigger(): void {
    ScrollTrigger.create({
      trigger: this.wrapper,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const rotation = self.progress * 360;
        this.textWrapper.style.transform = `rotateZ(15deg) rotateY(${rotation}deg)`;
      },
    });
  }

  public resize(): void {
    this.calculatePositions();
  }
}
