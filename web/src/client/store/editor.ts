import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_SPARQL_QUERY = `SELECT ?subject ?predicate ?object
WHERE {
  ?subject ?predicate ?object
}
LIMIT 25`;

type SparqlEditorStoreState = {
  editorText: string;
  setEditorText: (editorText: string) => void;
};

export const useSparqlEditorStore = create<SparqlEditorStoreState>()(
  persist(
    (set) => ({
      editorText: INITIAL_SPARQL_QUERY,
      setEditorText: (editorText: string) => {
        set({ editorText });
      },
    }),
    { name: "editor" }
  )
);
