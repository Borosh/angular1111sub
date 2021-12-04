import { Action } from "@ngrx/store";
import { Observable, of, throwError } from "rxjs";
import { PersonEffects } from "./person.effects";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import {
  mockPerson,
  mockPersonGetRequest,
  mockPersons,
} from "@shared/testing/mock-perons";
import { TestBed } from "@angular/core/testing";
import { PersonService } from "@person/services/person.service";
import { initialPersonState, PersonState } from "../models/person-state.model";
import { Actions } from "@ngrx/effects";
import { cold, hot } from "jasmine-marbles";
import {
  getPersonNextPage,
  getPersonsByPage,
  getPersonsByPageFailed,
  getPersonsByPageSuccess,
  setTotalNumberOfPersons,
} from "../actions";

const initialMockState: { persons: PersonState } = {
  persons: initialPersonState,
};

fdescribe("PersonEffects", () => {
  let personEffects: PersonEffects;
  let actions$ = new Observable<Action>();
  let store: MockStore;
  let service: PersonService;

  const mockPersonService = {
    getPersons: (_: number) => of(mockPersonGetRequest),
    getPersonById: (_: number) => of(mockPerson),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PersonService,
          useValue: mockPersonService,
        },
        provideMockStore({ initialState: initialMockState }),
        provideMockActions(() => actions$),
        PersonEffects,
      ],
    }).compileComponents();

    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(MockStore);
    personEffects = TestBed.inject(PersonEffects);
    service = TestBed.inject(PersonService);
  });

  it("should create", () => {
    expect(personEffects).toBeTruthy();
  });

  describe("getPersonNextPage$", () => {
    it("should dispatch getPersonsByPage action", () => {
      store.setState({
        ...initialMockState,
        persons: {
          ...initialMockState.persons,
          current: 1,
        },
      });

      actions$ = hot("---a", { a: getPersonNextPage() });
      const expectedAction$ = cold("---a", {
        a: getPersonsByPage({ page: 2 }),
      });
      expect(personEffects.getPersonNextPage$).toBeObservable(expectedAction$);
    });
  });

  describe("getPersonsByPage$", () => {
    it("should dispatch getPersonsByPageSuccess action if the page is already loaded", () => {
      store.setState({
        ...initialMockState,
        persons: {
          ...initialMockState.persons,
          entitiesByPage: {
            1: [1, 2, 3],
          },
        },
      });

      const getPersonsSpy = spyOn(service, "getPersons");

      actions$ = hot("---a", { a: getPersonsByPage({ page: 1 }) });
      const expectedAction$ = cold("---a", {
        a: getPersonsByPageSuccess({ page: 1 }),
      });
      expect(personEffects.getPersonsByPage$).toBeObservable(expectedAction$);
      expect(getPersonsSpy).not.toHaveBeenCalled();
    });
    it("should dispatch getPersonsByPageSuccess action if the page is already loaded", () => {
      store.setState({
        ...initialMockState,
        persons: {
          ...initialMockState.persons,
          entitiesByPage: {
            1: [],
          },
        },
      });

      actions$ = hot("---a", { a: getPersonsByPage({ page: 1 }) });
      const expectedAction$ = cold("---(ab)", {
        a: getPersonsByPageSuccess({
          page: 1,
          persons: mockPersonGetRequest.results,
        }),
        b: setTotalNumberOfPersons({
          totalNumberOfPersons: mockPersonGetRequest.count,
        }),
      });
      expect(personEffects.getPersonsByPage$).toBeObservable(expectedAction$);
    });
    it("should dispatch getPersonsByPageFailed action on error", () => {
      store.setState({
        ...initialMockState,
        persons: {
          ...initialMockState.persons,
          entitiesByPage: {
            1: [],
          },
        },
      });

      const error = new Error("test");
      spyOn(service, "getPersons").and.returnValue(
        throwError(new Error("test"))
      );

      actions$ = hot("---a", { a: getPersonsByPage({ page: 1 }) });
      const expectedAction$ = cold("---a", {
        a: getPersonsByPageFailed({ error: error }),
      });
      expect(personEffects.getPersonsByPage$).toBeObservable(expectedAction$);
    });
  });
});
