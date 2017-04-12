import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  public targetElement: any;
  public isOpen: boolean;
  public current: Element;
  public onDocumentClickHandler;

  constructor(private el: ElementRef) {
    this.targetElement = this.el.nativeElement;
    this.isOpen = false;
    this.onDocumentClickHandler = this.onDocumentClick.bind(this);
  }

  private setToogle(event: Element) {
    if (event.classList.contains("header-menu")) {
      this.toggle();    
    } else if (event.classList.contains("menu-item")) {
       this.setValue(event);
       this.close();
    }
  }

  private onDocumentClick(event: Event) {
    if (!this.targetElement.contains(event.target)) this.close();
  }

  private setValue(value: Element): void {
    let btn: Element = this.targetElement.querySelector('.header-menu img');
    let img: Element = value.querySelector("img");
    btn.setAttribute("src", img.getAttribute("src"));
    btn.setAttribute("name", img.getAttribute("name"));
  }

  private toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  private open(): void {
    this.getMenuUl().classList.remove('close');
    document.addEventListener('click', this.onDocumentClickHandler);
    this.isOpen = true;
  }

  private close(): void {
    this.getMenuUl().classList.add('close');
    document.removeEventListener('click', this.onDocumentClickHandler);
    this.isOpen = false;
  }
  private getMenuUl(): Element {
    return (this.targetElement as HTMLElement).querySelector("ul.menu");
  }

  @HostListener('click', ['$event.target']) onClick(e: EventTarget) {
      this.targetElement = this.el.nativeElement;
      if ((e as HTMLElement).closest("button.header-menu")) {
        this.current = (e as HTMLElement).closest("button.header-menu");
      } else if ((e as HTMLElement).closest("li.menu-item")) {
        this.current = (e as HTMLElement).closest("li.menu-item");
      }
      this.setToogle(this.current);
   }

}
