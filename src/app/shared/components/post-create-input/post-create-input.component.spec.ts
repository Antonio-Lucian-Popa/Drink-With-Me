import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreateInputComponent } from './post-create-input.component';

describe('PostCreateInputComponent', () => {
  let component: PostCreateInputComponent;
  let fixture: ComponentFixture<PostCreateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCreateInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCreateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
