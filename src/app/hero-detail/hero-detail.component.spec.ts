import { TestBed, ComponentFixture, fakeAsync, tick, flush, async } from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { Location } from '@angular/common';
import { of } from "rxjs/internal/observable/of";
import { FormsModule } from "@angular/forms";

describe('HeroDetailComponent',()=>{
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService, mockLocation;

    beforeEach(()=>{
        mockActivatedRoute = {
            snapshot: { paramMap: {get:()=>{ return '3';}}}
        };

        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj(['back']);

        TestBed.configureTestingModule({
            imports: [FormsModule], //for Can't bind to 'ngModel' since it isn't a known property of 'input'. ("
            declarations: [HeroDetailComponent],
            providers: [ 
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: HeroService, useValue: mockHeroService},
                {provide: Location, useValue: mockLocation},
            ]
        });
        fixture = TestBed.createComponent(HeroDetailComponent);
        mockHeroService.getHero.and.returnValue(of({id: 1, name: 'SpiderDude', strength: 8}));
    })

    it('should render hero name in a h2 tag', ()=>{
        fixture.detectChanges();
        
        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SPIDERDUDE');
    })

    it('should call updateHero when save is called', (done)=>{
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();

        setTimeout(()=>{
            expect(mockHeroService.updateHero).toHaveBeenCalled();
            done();
        }, 300);
    })

    it('should call updateHero when save is called improved', fakeAsync(()=>{
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();
        //tick(250);
        flush();//fast foward to the next waiting task, used when the wait is unknown.

        expect(mockHeroService.updateHero).toHaveBeenCalled();

    }))

    it('should call updateHero when saveAngular is called', async(()=>{
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.saveAngularJS();

        fixture.whenStable().then(()=>{
        expect(mockHeroService.updateHero).toHaveBeenCalled();
        });
    }))
})