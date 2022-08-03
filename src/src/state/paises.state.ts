import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { PaisesAction } from './paises.actions';

export class PaisesStateModel {
  public items: string[];
}

const defaults = {
  items: []
};

@State<PaisesStateModel>({
  name: 'paises',
  defaults
})
@Injectable()
export class PaisesState {
  @Action(PaisesAction)
  add({ getState, setState }: StateContext<PaisesStateModel>, { payload }: PaisesAction) {
    const state = getState();
    setState({ items: [ ...state.items, payload ] });
  }
}
