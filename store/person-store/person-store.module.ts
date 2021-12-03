import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PersonEffects } from './effects/person.effects';
import { getPersonsReducer } from './reducers/person.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('persons', getPersonsReducer),
    EffectsModule.forFeature([PersonEffects]),
  ],
})
export class PersonStoreModule {}
