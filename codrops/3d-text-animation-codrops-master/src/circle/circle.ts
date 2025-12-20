import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CircleConfig {
  wrapper: HTMLElement;
  items: NodeListOf<HTMLElement>;
  radius: number;
  direction: number;
}

export class Circle {
  leftConfig: CircleConfig;
  rightConfig: CircleConfig;
  centerX!: number;
  centerY!: number;

  constructor() {
    this.leftConfig = {
      wrapper: document.querySelector(
        ".circle__text__wrapper__left"
      ) as HTMLElement,
      items: document.querySelectorAll(".circle__text__left__item"),
      radius: 0,
      direction: 1,
    };

    this.rightConfig = {
      wrapper: document.querySelector(
        ".circle__text__wrapper__right"
      ) as HTMLElement,
      items: document.querySelectorAll(".circle__text__right__item"),
      radius: 0,
      direction: -1,
    };

    this.updateDimensions();
    this.init();
  }

  init(): void {
    if (!this.leftConfig.wrapper || !this.rightConfig.wrapper) return;
    this.calculateInitialPositions();
    this.createScrollAnimations();
  }

  updateDimensions(): void {
    if (!this.leftConfig.wrapper || !this.rightConfig.wrapper) return;
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;
    this.leftConfig.radius = this.leftConfig.wrapper.offsetWidth / 2;
    this.rightConfig.radius = this.rightConfig.wrapper.offsetWidth / 2;
  }

  calculateInitialPositions(): void {
    this.updateItemsPosition(this.leftConfig, 0);
    this.updateItemsPosition(this.rightConfig, 0);
  }

  updateItemsPosition(config: CircleConfig, scrollY: number): void {
    const { items, radius, direction } = config;
    const totalItems = items.length;
    const spacing = Math.PI / totalItems;

    items.forEach((item, index) => {
      const angle = index * spacing - scrollY * direction * Math.PI * 2;
      const x = this.centerX + Math.cos(angle) * radius;
      const y = this.centerY + Math.sin(angle) * radius;

      const rotationOffset = direction === -1 ? 180 : 0;
      const rotation = (angle * 180) / Math.PI + rotationOffset;

      gsap.set(item, {
        x,
        y,
        rotation,
        transformOrigin: "center center",
      });
    });
  }

  createScrollAnimations(): void {
    ScrollTrigger.create({
      trigger: ".circle__wrapper",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const scrollY = self.progress * 0.5;
        this.updateItemsPosition(this.leftConfig, scrollY);
        this.updateItemsPosition(this.rightConfig, scrollY);
      },
    });
  }

  resize(): void {
    this.updateDimensions();
    this.calculateInitialPositions();
  }
}
