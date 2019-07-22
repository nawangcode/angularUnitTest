import { HeroesComponent } from "./heroes.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, Input, Component, Directive } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs/internal/observable/of";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

// instead of schemas: [NO_ERRORS_SCHEMA], create fake router link
@Directive({
    selector: '[routerLink]',
    host: {'(click)': 'onClick()'}
})
export class RouterLinkDirectiveStub{
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick(){
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent deep test', ()=>{         //deep integration test will test the child component
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;


    beforeEach(()=>{
        HEROES = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Wonderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ]

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations:[
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService } //longhand provice services
            ],
  //          schemas: [NO_ERRORS_SCHEMA]  //for Can't bind to 'routerLink' since it isn't a known property of 'a'. ("<a [ERROR ->]routerLink="/detail/{{hero.id}}">
        });
        fixture = TestBed.createComponent(HeroesComponent);


    })

    it('should be true', ()=>{
        expect(true).toBe(true);
    })

    it('should render each hero as a HeroComponent', ()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnInit
        fixture.detectChanges(); // call on the parent component(heroes), but both parent and child component gonna get initialized

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toBe(3);
        expect(heroComponentDEs[0].componentInstance.hero.name).toBe('SpiderDude');
        for(let i=0; i<heroComponentDEs.length;i++)
        {
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    })

    it(`should call heroService.deleteHero when the Hero Component's delete button is clicked, 
            triggered in css element`, ()=>{
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnInit
        fixture.detectChanges(); // call on the parent component(heroes), but both parent and child component gonna get initialized

        //get a collection of the hero component
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponents[0].query(By.css('button'))
            .triggerEventHandler('click', {stopPropagation: ()=> {}});

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

    })

    it(`should call heroService.deleteHero when the Hero Component's delete button is clicked, 
            triggered by raising the delete event directly in child component`, ()=>{
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnInit
        fixture.detectChanges(); // call on the parent component(heroes), but both parent and child component gonna get initialized

        //get a collection of the hero component
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);      // when raising the event, there is no argument in this.delete.next(); the binding happens in the html

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

    })

    it(`should call heroService.deleteHero when the Hero Component's delete button is clicked, 
            triggered by raising the delete event directly in child element`, ()=>{
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnInit
        fixture.detectChanges(); // call on the parent component(heroes), but both parent and child component gonna get initialized

        //get a collection of the hero component
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponents[0].triggerEventHandler('delete', null);

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

    })

    // interacting with input box
    it('should add a new hero to the hero list when the add button is clicked', ()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnInit
        fixture.detectChanges(); // call on the parent component(heroes), but both parent and child component gonna get initialized

        const name = 'Mr. Ice';

        mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addElement = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        addElement.triggerEventHandler('click', null);
        fixture.detectChanges();

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);
    })

    it('should have the correct route for the first hero', ()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnInit
        fixture.detectChanges(); // call on the parent component(heroes), but both parent and child component gonna get initialized
        
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        let routerLink = heroComponents[0]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);
        
        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

        expect(routerLink.navigatedTo).toBe('/detail/1');

    })
})