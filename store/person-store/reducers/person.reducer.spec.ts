import { mockPerson, mockPersons } from "@shared/testing/mock-perons";
import {
  getPersonByIdSuccess,
  getPersonsByPage,
  getPersonsByPageSuccess,
} from "../actions";
import { initialPersonState } from "../models/person-state.model";
import { getPersonsReducer } from "./person.reducer";

describe("PersonReducer", () => {
  describe("getPersonsByPage", () => {
    it("should update the state", () => {
      const newState = getPersonsReducer(
        initialPersonState,
        getPersonsByPage({ page: 1 })
      );
      expect(newState).toEqual({
        ...initialPersonState,
        loading: true,
        loaded: false,
        error: null,
        currentPage: 1,
      });
    });
  });
  describe("getPersonsByPageSuccess", () => {
    it("should update loading flag", () => {
      const newState = getPersonsReducer(
        { ...initialPersonState, loading: true },
        getPersonsByPageSuccess({ persons: mockPersons, page: 1 })
      );
      expect(newState.loading).toBeFalse();
    });
    it("should update loaded flag", () => {
      const newState = getPersonsReducer(
        { ...initialPersonState, loaded: false },
        getPersonsByPageSuccess({ persons: mockPersons, page: 1 })
      );
      expect(newState.loaded).toBeTrue();
    });
    it("should add persons to entitiesById object", () => {
      const newState = getPersonsReducer(
        initialPersonState,
        getPersonsByPageSuccess({ persons: mockPersons, page: 1 })
      );
      expect(newState.entitiesById).toEqual({
        [mockPersons[0].id]: mockPersons[0],
        [mockPersons[1].id]: mockPersons[1],
        [mockPersons[2].id]: mockPersons[2],
      });
    });
    it("should add persons to entitiesById object and keep the old ones", () => {
      const newState = getPersonsReducer(
        {
          ...initialPersonState,
          entitiesById: {
            99: { ...mockPersons[0], id: 99 },
          },
        },
        getPersonsByPageSuccess({ persons: mockPersons, page: 1 })
      );
      expect(newState.entitiesById).toEqual({
        [mockPersons[0].id]: mockPersons[0],
        [mockPersons[1].id]: mockPersons[1],
        [mockPersons[2].id]: mockPersons[2],
        99: { ...mockPersons[0], id: 99 },
      });
    });
    it("should add persons to page", () => {
      const newState = getPersonsReducer(
        initialPersonState,
        getPersonsByPageSuccess({ persons: mockPersons, page: 1 })
      );
      expect(newState.entitiesByPage).toEqual({
        1: [1, 2, 3],
      });
    });
    it("should add persons to page and keep the rest", () => {
      const newState = getPersonsReducer(
        { ...initialPersonState, entitiesByPage: { 2: [4, 5, 6] } },
        getPersonsByPageSuccess({ persons: mockPersons, page: 1 })
      );
      expect(newState.entitiesByPage).toEqual({
        1: [1, 2, 3],
        2: [4, 5, 6],
      });
    });
    it("should add persons to page and keep the rest", () => {
      const newState = getPersonsReducer(
        { ...initialPersonState, entitiesByPage: { 1: [1, 2], 2: [4, 5, 6] } },
        getPersonsByPageSuccess({ page: 1 })
      );
      expect(newState.entitiesByPage).toEqual({
        1: [1, 2],
        2: [4, 5, 6],
      });
    });
  });
  describe("getPersonByIdSuccess", () => {
    it("should add person to entitiesById", () => {
      const newState = getPersonsReducer(
        initialPersonState,
        getPersonByIdSuccess({ person: mockPerson })
      );
      expect(newState.entitiesById).toEqual({ [mockPerson.id]: mockPerson });
    });
    it("should add person to entitiesById and keep the rest", () => {
      const newState = getPersonsReducer(
        {
          ...initialPersonState,
          entitiesById: { 99: { ...mockPerson, id: 99 } },
        },
        getPersonByIdSuccess({ person: mockPerson })
      );
      expect(newState.entitiesById).toEqual({
        [mockPerson.id]: mockPerson,
        99: { ...mockPerson, id: 99 },
      });
    });
    it("should update person in entitiesById object", () => {
      const newState = getPersonsReducer(
        {
          ...initialPersonState,
          entitiesById: {
            99: { ...mockPerson, id: 99 },
            [mockPerson.id]: {
              name: "test",
              height: 1,
              gender: "test",
              mass: 50,
              url: "#",
              id: mockPerson.id,
            },
          },
        },
        getPersonByIdSuccess({ person: mockPerson })
      );
      expect(newState.entitiesById).toEqual({
        [mockPerson.id]: mockPerson,
        99: { ...mockPerson, id: 99 },
      });
    });
  });
});
